const puppeteer = require('puppeteer');

(async () => {
  const BASE = 'http://localhost:5173';
  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Set localStorage before any page loads
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ga_token', 'initial-token-123');
    localStorage.setItem('currentUser', JSON.stringify({ id: '1', name: 'Test User', avatar: '', socials: {} }));
    localStorage.setItem('artistId', '1');
  });

  try {
    console.log('Navigating to artist profile...');
    await page.goto(`${BASE}/artist/1`, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for edit button and click it
    await page.waitForSelector('button', { timeout: 10000 });
    // click the button that contains "Éditer mon profil"
    const editButtons = await page.$x("//button[contains(., 'Éditer mon profil') or contains(., '✏️')]");
    if (!editButtons || editButtons.length === 0) {
      console.error('Edit button not found on profile page');
      await browser.close();
      process.exit(2);
    }
    await editButtons[0].click();

    // Wait for modal input (placeholder 'Nom complet')
    await page.waitForSelector('input[placeholder="Nom complet"]', { timeout: 5000 });

    // Change the name
    await page.focus('input[placeholder="Nom complet"]');
    await page.evaluate(() => { document.querySelector('input[placeholder="Nom complet"]').value = ''; });
    await page.type('input[placeholder="Nom complet"]', 'Updated Test Name');

    // Submit form by clicking 'Enregistrer'
    const saveButtons = await page.$x("//button[contains(., 'Enregistrer')]");
    if (!saveButtons || saveButtons.length === 0) {
      console.error('Save button not found');
      await browser.close();
      process.exit(3);
    }
    await saveButtons[0].click();

    // Wait a moment for modal to close and changes to apply
    await page.waitForTimeout(1000);

    // Read localStorage values
    const ga_token = await page.evaluate(() => localStorage.getItem('ga_token'));
    const legacy_token = await page.evaluate(() => localStorage.getItem('token'));
    const currentUser = await page.evaluate(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));

    console.log('ga_token:', ga_token);
    console.log('legacy token (token):', legacy_token);
    console.log('currentUser.name:', currentUser && currentUser.name);

    let ok = true;
    if (ga_token !== 'initial-token-123') {
      console.error('ERROR: ga_token changed after profile save!');
      ok = false;
    }
    if (legacy_token) {
      console.error('ERROR: legacy "token" key was set (should not be).');
      ok = false;
    }
    if (!currentUser || currentUser.name !== 'Updated Test Name') {
      console.error('ERROR: currentUser name not updated in localStorage');
      ok = false;
    }

    await browser.close();
    process.exit(ok ? 0 : 4);

  } catch (e) {
    console.error('Test failed with exception:', e);
    await browser.close();
    process.exit(5);
  }
})();
