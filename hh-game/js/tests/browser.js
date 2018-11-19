const puppeteer = require('puppeteer');

// npm i puppeteer

(async () => {
  const timeout = ms => new Promise(res => setTimeout(res, ms))
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:8080/testRunner.html');
  await timeout(10000)
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();