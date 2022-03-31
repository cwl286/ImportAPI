'use strict';

require('dotenv').config(); // Get setting from .env
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());
const randomUseragent = require('random-useragent');
const proxyChain = require('proxy-chain');
/**
 * download document from html
 * @param {string} url 
 * @return {string} whole html
 */
const getHtml = async function (url) {
    try {
        const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1)
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36`;

        const args = ['--no-sandbox', '--disable-setuid-sandbox'];
        if (process.env.PROXY_SERVER) {
            args.push(await proxyChain.anonymizeProxy(oldProxyUrl));
        }
        const browser = await puppeteer.launch(
            {
                headless: true,
                executablePath: process.env.CHROME_BIN || null,
                args: args,
                ignoreHTTPSErrors: true,
                dumpio: false,
            },
        );
        const page = await browser.newPage();
        const userAgent = randomUseragent.getRandom();
        const newUserAgent = userAgent || USER_AGENT;
        // Randomize viewport size
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        await page.setUserAgent(newUserAgent);
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url, { waitUntil: 'networkidle0' });
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
        console.log(['model/html getHtml() Error: ', url]);
        throw new Error(`Problem in getting html ${err}`);
    }
};

module.exports = getHtml;
