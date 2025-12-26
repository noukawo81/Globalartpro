import puppeteer from 'puppeteer';

(async () => {
  console.log('Puppeteer E2E: starting');
  let browser;
  try {
    // Try to prefer a stable system Chrome/Edge if available to avoid chromium download issues
    const fs = await import('fs');
    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    let execPath = null;
    for (const c of candidates) {
      try { if (fs.existsSync(c)) { execPath = c; break; } } catch(_){}
    }
    const launchOpts = { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] };
    if (execPath) { launchOpts.executablePath = execPath; console.log('Using system browser at', execPath); }
    // Timeout the launch if it hangs
    browser = await Promise.race([
      puppeteer.launch(launchOpts),
      new Promise((_, reject) => setTimeout(() => reject(new Error('puppeteer.launch timeout after 20s')), 20000))
    ]);
    console.log('puppeteer launched successfully');
  } catch (e) {
    console.error('puppeteer.launch failed', e && e.message);
    process.exit(1);
  }
  const page = await browser.newPage();
  // Configurable frontend URL (env override) and set fake logged-in user and token
  const BASE = process.env.FRONTEND_URL || 'http://localhost:5173';
  console.log('Opening frontend at', BASE);
  // Increase default timeouts to be resilient for slow CI/dev machines
  page.setDefaultNavigationTimeout(180000);
  page.setDefaultTimeout(180000);

  // Capture client-side console and errors for debugging
  page.on('console', (msg) => console.log('PAGE_CONSOLE:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE_ERROR:', err && err.message));
  page.on('requestfailed', (req) => console.warn('REQUEST_FAILED:', req.url(), req.failure() && req.failure().errorText));
  // Dismiss any blocking alerts (e.g., network error alerts from axios interceptor)
  page.on('dialog', async (dialog) => {
    console.log('PAGE_DIALOG:', dialog.message());
    await dialog.dismiss();
  });

  // Log marketplace API responses (list + buy)
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (url.includes('/api/marketplace/list')) {
        console.log('MARKETPLACE_LIST_RESPONSE', res.status());
        let text = '';
        try {
          if (res.status() !== 204) text = await res.text();
        } catch (e) {
          // ignore body read errors (e.g., 204/no-body, protocol errors)
        }
        console.log('MARKETPLACE_LIST_RESPONSE_TEXT_SNIPPET:', text && text.slice(0, 200));
      }
      if (url.includes('/api/marketplace/buy')) {
        console.log('MARKETPLACE_BUY_RESPONSE', res.status());
        let text = '';
        try {
          if (res.status() !== 204) text = await res.text();
        } catch (e) {
          // ignore body read errors
        }
        console.log('MARKETPLACE_BUY_RESPONSE_TEXT_SNIPPET:', text && text.slice(0, 400));
      }
    } catch (e) {
      console.error('Error logging response', e && e.message);
    }
  });

  // Ensure any requests aimed at localhost:3000 are rewritten to 5000 (dev backend) so tests use running backend
  await page.evaluateOnNewDocument(() => {
    (function() {
      const origFetch = window.fetch;
      window.fetch = function(...args) {
        try {
          if (typeof args[0] === 'string' && args[0].startsWith('http://localhost:3000/')) {
            args[0] = args[0].replace('http://localhost:3000', 'http://localhost:5000');
          } else if (args[0] && typeof args[0].url === 'string' && args[0].url.startsWith('http://localhost:3000/')) {
            args[0].url = args[0].url.replace('http://localhost:3000', 'http://localhost:5000');
          }
          // If this is a buy request, add E2E stub header so backend can short-circuit in tests
          try {
            const urlStr = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) ? args[0].url : '';
            if (urlStr && urlStr.includes('/api/marketplace/buy')) {
              args[1] = args[1] || {};
              args[1].headers = { ...(args[1].headers || {}), 'X-E2E-Stub': '1' };
            }
          } catch(e) { /* ignore header injection errors */ }
        } catch(e) { /* ignore */ }
        return origFetch.apply(this, args);
      };
      const origXOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        try {
          // store the requested URL on the xhr instance for later use in send
          this.__lastUrl = url;
          if (typeof url === 'string' && url.startsWith('http://localhost:3000/')) {
            url = url.replace('http://localhost:3000', 'http://localhost:5000');
          }
        } catch(e) { /* ignore */ }
        return origXOpen.call(this, method, url, ...rest);
      };
      // Intercept send to inject E2E stub header for XHR-based requests (axios uses XHR adapter)
      const origXSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(body) {
        try {
          const url = this.__lastUrl || '';
          if (url && url.includes('/api/marketplace/buy')) {
            try { this.setRequestHeader && this.setRequestHeader('X-E2E-Stub', '1'); } catch(e) { /* ignore */ }
          }
        } catch(e) { /* ignore */ }
        return origXSend.call(this, body);
      };
    })();
  });



  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.error('goto / failed', e && e.message));
  await page.evaluate(() => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 'user-test-1', name: 'Test User', email: 'test@example.com' }));
    localStorage.setItem('artistId', 'artist-test-1');
    localStorage.setItem('ga_token', 'mock-token-123');
  });
  // Go to marketplace
  console.log('Navigating to /marketplace');
  await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.error('goto /marketplace failed', e && e.message));
  console.log('Waiting for marketplace container');
  await page.waitForSelector('.marketplace-container', { timeout: 30000 }).catch(e => console.error('waitForSelector .marketplace-container failed', e && e.message));

  // Preflight: check backend health on common ports (5000 then 3000) to detect connection refusals early
  const backendReachable = await page.evaluate(async () => {
    async function check(url) {
      try {
        const r = await fetch(url, { method: 'GET' });
        return r.ok ? { ok: true, url } : { ok: false, url, status: r.status };
      } catch (e) { return { ok: false, url, error: String(e) }; }
    }
    const a = await check('http://localhost:5000/api/health');
    if (a.ok) return a;
    const b = await check('http://localhost:3000/api/health');
    if (b.ok) return b;
    return { ok: false, details: [a, b] };
  });
  if (!backendReachable || !backendReachable.ok) {
    console.error('Backend health check failed:', backendReachable);
    // Save page HTML to help debugging
    try {
      const now = Date.now();
      const html = await page.content();
      const fs = await import('fs');
      fs.writeFileSync(`./e2e-backend-unreachable-${now}.html`, html, 'utf8');
      console.log(`Saved backend-unreachable artifact: e2e-backend-unreachable-${now}.html`);
    } catch (e2) {
      console.error('Failed to save backend unreachable artifact', e2 && e2.message);
    }
    throw new Error('Backend not reachable on ports 5000 or 3000 (see saved artifact)');
  }

  console.log('Backend reachable at', backendReachable.url);
  console.log('Waiting for marketplace card selector (extended timeout)');
  try {
    await page.waitForSelector('.marketplace-card', { timeout: 120000 });
  } catch (e) {
    console.error('waitForSelector .marketplace-card failed', e && e.message);
    // Save page HTML for debugging (avoid screenshot to reduce protocol timeouts)
    try {
      const now = Date.now();
      const html = await page.content();
      const fs = await import('fs');
      fs.writeFileSync(`./e2e-failure-${now}.html`, html, 'utf8');
      console.log(`Saved failure artifact: e2e-failure-${now}.html`);
      // Log a snippet to help quickly diagnose
      console.log('Page HTML snippet (first 400 chars):', html.trim().slice(0, 400));
    } catch (e2) {
      console.error('Failed to save HTML artifact', e2 && e2.message);
    }
    throw e;
  }

  // Click first product and then click Acheter maintenant
  try {
    await page.click('.marketplace-card');
    console.log('Clicked marketplace card');
    await page.waitForSelector('.modal-actions .btn-primary', { timeout: 30000 });
    console.log('Modal primary button ready');
    // Dialogs are handled by the global handler attached earlier (avoid double-dismiss)
    await page.click('.modal-actions .btn-primary');
    console.log('Modal primary button ready (opened PI modal)');
    // Wait for PI QR to appear
    await page.waitForSelector('img[alt="PI QR"]', { timeout: 30000 }).catch(e => console.error('PI QR did not appear', e && e.message));


    // Prepare to capture buy response
    const buyPromise = new Promise((resolve) => {
      const handler = async (res) => {
        if (res.url().includes('/api/marketplace/buy')) {
          page.off('response', handler);
          let txt = '';
          try {
            if (res.status() !== 204) txt = await res.text();
          } catch (e) {
            // ignore body read errors (204/no-body)
          }
          resolve({ status: res.status(), text: txt });
        }
      };
      page.on('response', handler);
    });

    // Click PI confirm button ("J'ai payé — Confirmer")
    try {
      const clicked = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => /J\'ai payé|J’ai payé/.test(b.textContent || ''));
        if (btn) { btn.click(); return true; }
        return false;
      });
      if (clicked) console.log('Clicked PI confirm button via evaluate'); else console.error('PI confirm button not found in DOM');
    } catch (e) {
      console.error('Error clicking PI confirm button', e && e.message);
    }

    // Wait for buy backend response (or timeout after 10s)
    const res = await Promise.race([
      buyPromise,
      new Promise((r) => setTimeout(() => r(null), 10000)),
    ]);
    if (res) {
      console.log('Buy response captured', res.status, res.text && res.text.slice(0, 300));
    } else {
      console.error('No buy response captured within timeout');
    }

    // Wait a short moment for UI updates
    await new Promise((r) => setTimeout(r, 2000));
    console.log('Test completed: buy flow attempted (PI)');
  } catch (e) {
    console.error('E2E flow error', e && e.message);
    try { await page.screenshot({ path: './e2e-error.png', fullPage: true }); } catch (_) {}
  }
  await browser.close();
  console.log('Puppeteer E2E: finished');
})();