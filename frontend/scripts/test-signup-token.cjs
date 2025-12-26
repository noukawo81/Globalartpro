const puppeteer = require('puppeteer');

(async () => {
  const BASE = 'http://localhost:5173';
  console.log('Launching headless browser for signup test...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Start with no token
  await page.evaluateOnNewDocument(() => {
    localStorage.removeItem('ga_token');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('artistId');
  });

  try {
    console.log('Opening artists signup page...');
    await page.goto(`${BASE}/artists`, { waitUntil: 'networkidle2', timeout: 60000 });

    // Fill form inputs by index (order: lastName, firstName, email, password, ...)
    const timestamp = Date.now();
    const lastName = 'TestLast';
    const firstName = 'TestFirst';
    const email = `e2e+signup+${timestamp}@example.com`;
    const password = 'password123';

    await page.waitForSelector('form', { timeout: 10000 });

    const inputs = await page.$$('form input');
    if (inputs.length < 4) {
      console.error('Unexpected number of inputs, found', inputs.length);
      await browser.close();
      process.exit(2);
    }

    await inputs[0].click();
    await inputs[0].type(lastName);
    await inputs[1].click();
    await inputs[1].type(firstName);
    await inputs[2].click();
    await inputs[2].type(email);
    await inputs[3].click();
    await inputs[3].type(password);

    // Submit by clicking the button 'Créer mon compte'
    const submitBtn = await page.$x("//button[contains(., 'Créer mon compte')]");
    if (!submitBtn || submitBtn.length === 0) {
      console.error('Signup submit button not found');
      await browser.close();
      process.exit(3);
    }
    await submitBtn[0].click();

    // Wait for a short time for navigation or localStorage updates
    await page.waitForTimeout(1500);

    // Read localStorage
    const ga_token = await page.evaluate(() => localStorage.getItem('ga_token'));
    const legacy_token = await page.evaluate(() => localStorage.getItem('token'));
    const currentUser = await page.evaluate(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));
    const artistId = await page.evaluate(() => localStorage.getItem('artistId'));

    console.log('ga_token:', ga_token);
    console.log('legacy token (token):', legacy_token);
    console.log('currentUser:', currentUser && currentUser.name);
    console.log('artistId:', artistId);

    let ok = true;
    if (!ga_token) {
      console.error('ERROR: ga_token is missing after signup');
      ok = false;
    }
    if (legacy_token) {
      console.error('ERROR: legacy "token" key was set (should not be).');
      ok = false;
    }
    if (!currentUser || !(currentUser.name || currentUser.email)) {
      console.error('ERROR: currentUser not set in localStorage');
      ok = false;
    }

    await browser.close();
    process.exit(ok ? 0 : 4);

  } catch (e) {
    console.error('Test failed with exception:', e);
    try { await browser.close(); } catch (err) {}
    process.exit(5);
  }
})();
