const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());
const randomUseragent = require('random-useragent');
const proxyChain = require('proxy-chain');
const axios = require('axios').default;

const { config } = require('../config');
const { customErrors } = require('../controllers/error/index');

const DEFAULT_USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64)
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.361`;

/**
 * download full document by puppetteer (with header and body)
 * @param {string} url 
 * @return {string} whole html
 */
const getHtmlByPT = async function (url) {
    try {
        // set arguments
        const optionArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
        if (config.puppeteer.proxyUrl) {
            const newProxyUrl = await proxyChain.anonymizeProxy({ proxyUrl: config.puppeteer.proxyUrl });
            optionArgs.push(`--proxy-server=${newProxyUrl}`);
        }
        // puppeteer launch options
        const options = {
            headless: true,
            args: optionArgs,
            ignoreHTTPSErrors: true,
            dumpio: false,
        };

        if (config.puppeteer.browser) {
            option['executablePath'] = config.puppeteer.browser;
        }

        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        // Randomize viewport size
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        const userAgent = randomUseragent.getRandom() || DEFAULT_USER_AGENT;
        await page.setUserAgent(userAgent);
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.cookies();
        const doc = await page.evaluate(
            /* istanbul ignore next */
            () => {
                return document.documentElement.outerHTML;
            });
        await browser.close();
        return doc;
    } catch (err) {
        throw new customErrors.BadRequestError(description = err.toString());
    }
};

/**
 * download full document by normal method (with header and body)
 * @param {string} url 
 * @return {string} whole html
 */
const getHtmlByAxios = async function (url) {
    const userAgent = randomUseragent.getRandom();
    const newUserAgent = userAgent || DEFAULT_USER_AGENT;

    return axios.get(url, { headers: { 'User-Agent': newUserAgent } })
        .then((res) => {
            if (res.status == 200 && res.data.toString().indexOf('Cloudflare') === -1) {
                return res.data;
            }
            throw new customErrors.BadRequestError(name = 'Axios Error',
                description = `Problem status code: ${res.status}`);
        })
        .catch((err) => {
            throw new customErrors.BadRequestError(name = 'Axios Error', description = err.toString());
        });
};

/**
 * download full document by normal method, if fail, try by another
 * @param {*} url 
 * @return {string} html
 */
const getHtml = async function (url) {
    try {
        return await getHtmlByAxios(url);
    } catch (err) {
        return await getHtmlByPT(url);
    }
};

module.exports = {
    getHtmlByAxios: getHtmlByAxios,
    getHtmlByPT: getHtmlByPT,
    getHtml: getHtml,
};
