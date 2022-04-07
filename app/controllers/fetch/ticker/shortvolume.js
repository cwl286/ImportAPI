const { logger } = require('../../logger/index');

/**
 * Get data from shortvolume.com
 * @param {string} ticker 
 * @return {object} dict of data in terms of Million
 */
const getData = async (ticker) => {
    const _url = `http://shortvolumes.com/?t=${ticker}`;

    const { getHtml } = require('../../../models/index');
    const { tryParseFloat } = require('../../aux/index');
    const html = await getHtml(_url);

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
        const unprocessedRows = str.split('],');
        const table = [];
        for (let i = 0; i < unprocessedRows.length; i++) {
            // split a row into cells
            let cells = unprocessedRows[i].replaceAll(']', '').replaceAll('[', '').replaceAll(`'`, '').split(',');
            // process each cell
            cells = cells.map(e => tryParseFloat(e.trim()));
            // convert last cell from percentage to 0.xx
            if (i > 0) {
                cells[cells.length - 1] = (cells[cells.length - 1]) ? tryParseFloat(cells[cells.length - 1]) / 100 : '';
            }
            // push a row to the table
            table.push(cells);
        }
        return table; // 2d arr
    }
    return (html) ? _parseRatio(html) : [];
};

/**
 * Get latest data of a ticker
 * @param {string} ticker 
 * @return {dict} latest data
 */
const getLatestData = async (ticker) => {
    const dict = {};
    const data = await getData(ticker);
    if (data.length > 1) {
        const header = data[0];
        const row = data[data.length - 1];
        for (let i = 0; i < header.length; i++) {
            dict[header[i]] = row[i];
        }
    }
    logger.info({shortvolume:dict});
    return dict;
};

module.exports = {
    getData: getData,
    getLatestData: getLatestData,
};
