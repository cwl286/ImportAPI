const xpath = require('xpath-html');
const { logger } = require('../../logger/index');

/**
 * Get data from finviz.com
 * @param {string} ticker 
 * @return {object} dict of data in terms of Million
 */
const getData = async (ticker) => {
    const _url = `https://finviz.com/quote.ashx?t=${ticker}`;

    const { getHtml } = require('../../../models/index');
    const { queryDOM } = require('../query/index');
    const { customErrors } = require('../../error/index');
    const { toMilBase, finToMathFormat, tryParseFloat } = require('../../aux/index');
    
    const html = await getHtml(_url);

    /**
     * local function to parse ratio
     * @param {string} html 
     * @return {object}
     */
    function _parseRatio(html) {
        const dict = {};
        const table = queryDOM(html, 'table', 8);
        let tdKeys = [], tdValues = [];
        try {
            tdKeys = xpath.fromPageSource(table).findElements('//td[text() and count(.//*) =0]');
            tdValues = xpath.fromPageSource(table).findElements('//td//*[text()]');
        } catch (err) {
            throw new customErrors.APIError(name = '_parseRatio Error', description = err.toString());
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
        logger.info({finviz:dict});
        return dict;
    }
    return (html) ? _parseRatio(html) : {};
};

module.exports = getData;
