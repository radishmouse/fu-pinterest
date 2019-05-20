const puppeteer = require('puppeteer');

let extractImage = async (url, selector) => {

  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto(url);
  
  await page.waitForSelector(selector);
  const srcArray = await page.$eval(selector, el => el.src);

  return Promise.resolve(srcArray);
};

module.exports = extractImage;

// (async () => {
//   extractImage('https://www.pinterest.com/pin/46161964902309066/', '.GrowthUnauthPinImage img');  
// })();


