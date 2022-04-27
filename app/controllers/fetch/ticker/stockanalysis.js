const xpath = require('xpath-html');
const { arrayToObject, tryParseFloat } = require('../../aux/index');
const { logger } = require('../../logger/index');
const { APIError } = require('../../error/index');

/**
 * Get data from StockAnalysis.com
 * @param {string} ticker 
 * @return {Array} array of data in terms of Million
 */
const crawlData = async (ticker) => {
    const _url = `https://stockanalysis.com/stocks/${ticker}/financials/ratios/trailing/`;

    const { getHtml } = require('../../../models/index');
    const { queryDOM } = require('../query/index');
    
    const html = await getHtml(_url);
    logger.trace({ 'stockanalysis html input': { ticker: html}});

    let table = (html)? queryDOM(html, 'table', 0) : '';
    table = table.replaceAll('&', '&amp;').replaceAll('/n', '').replaceAll('xmlns="http://www.w3.org/2000/svg"', '');
    logger.debug({'stockanalysis DOM table': {ticker: table.toString()}});

    /**
     * local function to parse ratio
     * @param {string} table 
     * @return {Array} 2d array of table
     */
    function _parseRatio(table) {
        let result = [];

        // process thead row
        const ths = xpath.fromPageSource(table).findElements('//thead//*[text()]');
        let processedRow = [];
        ths.forEach(th => processedRow.push(th.getText()));
        // last column is dummy on this website
        processedRow = processedRow.slice(0, processedRow.length - 1);
        result.push(processedRow);

        // process tbody rows
        const tbodyTrs = xpath.fromPageSource(table).findElements('//tbody//tr');
        for (const tr of tbodyTrs) {
            processedRow = [];
            const tds = xpath.fromNode(tr).findElements('//*[text()]');
            // Conver to number type if possible, otherwise return itself
            tds.forEach(td => processedRow.push(tryParseFloat(td.getText().trim())));
            // last column is dummy on this website     
            processedRow = processedRow.slice(0, processedRow.length - 1);
            result.push(processedRow);
        }
        return result;
    }
    return (table)? _parseRatio(table) : [];
};

/**
 * Get all data of a ticker
 * @param {string} ticker 
 * @return {object} all data
 */
 const getData = async (ticker) => {
    let result = {};
    const data = await crawlData(ticker);
    // to convert a table, which is in terms of arrays, into an Object of objects
    if (data.length > 1 && data[0].length > 0) {
        result = arrayToObject(data);
    }
    logger.info({ stockanalysis: result });
    return result;
};

/**
 * Get latest data of a ticker
 * @param {string} ticker 
 * @return {object} latest data
 */
const getLatestData = async (ticker) => {
    let result = {};
    const data = await getData(ticker);
    if (Object.keys(data).includes('Current')) {
        result['Current'] = data['Current'];
    }
    return result;
};

/**
 * Get data from StockAnalysis.com
 * @param {string} ticker 
 * @return {object} dict of data in terms of Million
 */
const getProfile = async (ticker) => {
    const _url = `https://stockanalysis.com/stocks/${ticker}/company/`;

    const { getHtml } = require('../../../models/index');
    const html = await getHtml(_url);
    logger.trace({ 'stockanalysis html input': { ticker: html}});

    /**
     * local function to parse ratio
     * @param {string} html 
     * @return {Array} 2d array of table
     */
    function _parseProfile(html) {
        let profile = {};
    
        // find the script and the following string
        let script = html.substring(
            html.lastIndexOf('<script id="__NEXT_DATA__"'),
            html.lastIndexOf('</script>') + 9
        );
        // find the script and the first </script>
        script = script.substring(
            script.indexOf('>') + 1, 
            script.indexOf('</script>')
        );
        logger.debug({'stockanalysis profile before JSON parse': {ticker: script}});

        try {
            profile = JSON.parse(script);
        } catch (err) {
            throw new APIError(name = '_parseProfile Error', description = err.toString());
        }
        return { ...profile.props.pageProps.info, ...profile.props.pageProps.data };
    }
    return (html) ? _parseProfile(html) : {};
};

module.exports = {
    crawlData: crawlData,
    getData: getData,
    getLatestData: getLatestData,
    getProfile: getProfile,
};
