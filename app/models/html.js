'use strict';

const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

/**
 * download document from html
 * @param {string} url 
 * @return {string} whole html
 */
const getHtml = async function (url) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
          });
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle0'});
        const cookies = await page.cookies();
        await page.setCookie(...cookies);
        const doc = await page.evaluate(
             /* istanbul ignore next */ 
            () => {
            return document.documentElement.outerHTML;
        });
        await browser.close();
        return doc;
    } catch (err) {
        console.log([url]);
        throw new Error(`Invalid URL ${err}`);
    }
};

module.exports = getHtml;
