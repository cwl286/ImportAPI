const xpath = require('xpath-html');
const { logger } = require('../../logger/index');
const { customErrors } = require('../../error/index');
const { tryParseFloat, transpose } = require('../../aux/index');
const _tableNames = {
    0: 'Yearly Numbers Estimates',
    1: 'Quarterly Numbers Actuals',
    2: 'Quarterly Numbers Estimates',
};
/**
 * class for Estimates in marketwatch
 */
class Estimates {
    /**
     * function to crawl tables
     * @param {string} ticker 
     * @return {object} object of tables, where tables are in terms of arrays 
     */
    async _crawlEstimates(ticker) {
        // download raw html
        const { getHtml } = require('../../../models/index');
        const url = `https://www.marketwatch.com/investing/stock/${ticker}/analystestimates?mod=mw_quote_tab`;
        const html = await getHtml(url);
        logger.trace({ 'marketwatch html input': { ticker: html } });

        /**
         * local function to parse html
         * @param {string} html 
         * @return {object} object of tables, where tables are in terms of arrays
         */
        const _parseRatio = (html) => {
            const dict = {};

            try {
                // Replace ill-format from the website
                html = html.replaceAll('aria=label', 'xxx');
                const tables = xpath.fromPageSource(html).findElements('//div[@class="element__body"]/table');

                logger.debug({ 'marketwatch DOM table': { ticker: tables.toString() } });                

                for (let i = 0; i < tables.length; i++) {
                    const table = tables[i];
                    const parsedTable = [], trs = xpath.fromNode(table).findElements('//tr');
                    for (const tr of trs) {
                        const cells = xpath.fromNode(tr).findElements('//*[name()="th" or name() = "td"]');
                        parsedTable.push(cells.map((cell) => tryParseFloat(cell.getText())));
                    }
                    dict[_tableNames[i]] = parsedTable;
                }
            } catch (err) {
                throw new customErrors.APIError(name = '_parseRatio Error', description = err.toString());
            }
            return dict;
        };
        return (html) ? _parseRatio(html) : {};
    }

    /**
     * local aux function to convert a table, which is in terms of arrays, into an Object
     * Object key is the first array 
     * @param {Array} arr a 2d array repsentating rows of a table
     * @return {Object} object of objects
     */
    _conversion(arr) {
        const result = {};
        if (arr.length > 1 && arr[0].length > 0) {
            const header = arr[0];
            const rows = arr.slice(1);
            for (const row of rows) {
                const dict = {};
                for (let i = 1; i < header.length; i++) {
                    dict[header[i]] = row[i];
                }
                result[row[0]] = dict;
            }
        }
        return result;
    }

    /**
     * Get all estimates from crawlEstimates() in terms of object
     * @param {string} ticker 
     * @return {object} object of objects
     */
    async getEstimates(ticker) {
        // get dict of raw tables 
        const dict = await this._crawlEstimates(ticker);
        for (const key in dict) {
            // get table in terms of array
            const table = dict[key];
            // transpose table and convert to dict 
            dict[key] = this._conversion(transpose(table));
        }

        logger.info({ 'marketwatch getEstimates': { ticker: dict } });
        return dict;
    }

    /**
     * Get current estimates data from marketwatch.com 
     * hard code
     * @param {string} ticker 
     * @return {object} dict of dict
     */
    async getCurrentEstimates(ticker) {
        // get dict of raw tables 
        const dict = await this._crawlEstimates(ticker);
        /**
         * local aux function to find the current year
         * @param {Array} arr 
         * @return {number} 'current year
         */
        const _findCururentYear = function (arr) {
            const currentYear = new Date().getFullYear();
            const found = arr.find(x => x == currentYear);
            if (found) {
                return found;
            }
            // tailer-made for 'Yearly Numbers Estimates' table
            arr.sort();
            return (arr.length > 1) ? arr[1] : arr[0];
        };
        // Process each table
        const table0 = dict[_tableNames[0]];
        const currentYear = _findCururentYear(table0[0]); // locate current year
        const orgdict0 = this._conversion(transpose(table0)); // transpose table and convert to dict 
        const newdict0 = {}; // reduce the org dict to current year
        newdict0[currentYear] = orgdict0[currentYear];
        dict[_tableNames[0]] = newdict0;

        const table1 = dict[_tableNames[1]];
        const lastQuarter = table1[0][table1[0].length-1]; // locate last quarter        
        const orgdict1 = this._conversion(transpose(table1)); // transpose table and convert to dict 
        const newdict1 = {}; // reduce the org dict to last quarter
        newdict1[lastQuarter] = orgdict1[lastQuarter];
        dict[_tableNames[1]] = newdict1;

        const table2 = dict[_tableNames[2]];
        const nextQuarter = table2[0][1]; // locate next quarter        
        const orgdict2 = this._conversion(transpose(table2)); // transpose table and convert to dict 
        const newdict2 = {}; // reduce the org dict to next quarter
        newdict2[nextQuarter] = orgdict2[nextQuarter];
        dict[_tableNames[2]] = newdict2;

        logger.info({ 'marketwatch getCurrentEstimates': { ticker: dict } });
        return dict;
    }
}

module.exports = {
    Estimates: new Estimates(),
};
