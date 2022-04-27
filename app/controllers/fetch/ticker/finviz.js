const xpath = require('xpath-html');
const { logger } = require('../../logger/index');
const { APIError } = require('../../error/index');

/**
 * Get data from finviz.com
 * @param {string} ticker 
 * @return {object} dict of data in terms of Million
 */
const getData = async (ticker) => {
    const _url = `https://finviz.com/quote.ashx?t=${ticker}`;

    const { getHtmlByPT } = require('../../../models/index');
    const { queryDOM } = require('../query/index');
    const { toMilBase, finToMathFormat, tryParseFloat } = require('../../aux/index');
    
    // download html
    const html = await getHtmlByPT(_url, 'domcontentloaded');
    logger.trace({ 'finviz html input': { ticker: html}});

    // query table
    let table = (html) ? queryDOM(html, 'table', 8) + queryDOM(html, 'table', 9) : '';
    table = (table) ? xpath.fromPageSource(table).findElements('//table[@class="snapshot-table2"]').toString() : '';

    logger.debug({'finviz DOM table': {ticker: table.toString()}});

    /**
     * local function to parse ratio
     * @param {string} table 
     * @return {object}
     */
    function _parseRatio(table) {
        const dict = {};
        
        let tdKeys = [], tdValues = [];
        try {
            tdKeys = xpath.fromPageSource(table).findElements('//td[text() and count(.//*) =0]');
            tdValues = xpath.fromPageSource(table).findElements('//td//*[text()]');
        } catch (err) {
            throw new APIError(name = '_parseRatio Error', description = err.toString());
        }

        for (let i = 0; tdKeys.length == tdValues.length && i < tdKeys.length; i++) {
            const key = tdKeys[i].getText().trim();

            let value = tdValues[i].getText();
            // Financial format: '(1,000B)' to Math format: '-1000B'
            value = finToMathFormat(value);
            // Convert to million base: '1B' to '1000'
            value = toMilBase(value);
            // Conver to number type if possible, otherwise return itself
            value = tryParseFloat(value);

            dict[key] = value;
        }
        const result = dict;
        logger.info({ finviz: result });
        return result;
    }
    return (table) ? _parseRatio(table) : {};
};

module.exports = getData;
