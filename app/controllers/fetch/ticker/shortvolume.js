const { logger } = require('../../logger/index');

/**
 * Get data from shortvolume.com
 * @param {string} ticker 
 * @return {Array} 2d array of table
 */
const crawlData = async (ticker) => {
    const _url = `http://shortvolumes.com/?t=${ticker}`;

    const { getHtml } = require('../../../models/index');
    const { tryParseFloat } = require('../../aux/index');
    const html = await getHtml(_url);
    logger.trace({ 'shortvolume html input': { ticker: html}});

    /**
     * local function to parse ratio
     * @param {string} html 
     * @return {Array} 2d array of table
     */
    function _parseRatio(html) {
        const startStr = 'var data = google.visualization.arrayToDataTable([';
        const endStr = 'var options = {';
        let str = html.substring(
            html.indexOf(startStr),
            html.indexOf(endStr));
        if (!str) {
            return []; // empty
        }
        str = str.replace(startStr, '').replace(']);', '');
        logger.debug({'shortvolume data': {ticker: str}});

        const unprocessedRows = str.split('],');
        const table = [];
        for (let i = 0; i < unprocessedRows.length; i++) {
            // split a row into cells
            let cells = unprocessedRows[i].replaceAll(']', '').replaceAll('[', '').replaceAll(`'`, '').split(',');
            // process each cell
            cells = cells.map(e => tryParseFloat(e.trim()));
            // push a row to the table
            table.push(cells);
        }
        return table; // 2d arr
    }
    return (html) ? _parseRatio(html) : [];
};

/**
 * Get all data of a ticker
 * @param {string} ticker 
 * @return {dict} all data
 */
const getData = async (ticker) => {
    const result = {};
    const data = await crawlData(ticker);

    if (data.length > 1 && data[0].length > 0) {
        const header = data[0];
        const rows = data.slice(1);
        for (const row of rows) {
            const dict = {};
            for (let i = 1; i < header.length && header[0] === 'Date'; i++) {
                dict[header[i]] = row[i];
            }
            result[row[0]] = dict;
        }
    }
    logger.info({ shortvolume: result });
    return result;
};

/**
 * Get latest data of a ticker
 * @param {string} ticker 
 * @return {dict} latest data
 */
const getLatestData = async (ticker) => {
    const result = {};
    const data = await crawlData(ticker);

    if (data.length > 1 && data[0].length > 0) {
        const dict = {};
        const header = data[0];
        const lastRow = data[data.length - 1];
        for (let i = 1; i < header.length && header[0] === 'Date'; i++) {
            dict[header[i]] = lastRow[i];
        }
        result[lastRow[0]] = dict;
    }
    logger.info({ shortvolume: result });
    return result;
};

module.exports = {
    crawlData: crawlData,
    getData: getData,
    getLatestData: getLatestData,
};
