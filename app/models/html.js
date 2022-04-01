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
        
        const DEFAULT_USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64)
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.361`;

        const args = ['--no-sandbox', '--disable-setuid-sandbox'];
        if (process.env.PROXY_SERVER) {
            args.push(await proxyChain.anonymizeProxy(oldProxyUrl));
        }
        const browser = await puppeteer.launch(
            {
                headless: true,
                // for docker, (install chromium)
                // executablePath: '/usr/bin/chromium-browser', 
                executablePath: process.env.CHROME_BIN || null,
                args: args,
                ignoreHTTPSErrors: true,
                dumpio: false,
            },
        );
        const page = await browser.newPage();
        const userAgent = randomUseragent.getRandom();
        const newUserAgent = userAgent || DEFAULT_USER_AGENT;
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
