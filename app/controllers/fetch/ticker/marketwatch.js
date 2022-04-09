const xpath = require('xpath-html');
const { logger } = require('../../logger/index');
const { customErrors } = require('../../error/index');
const { tryParseFloat, toMilBase, finToMathFormat, transpose, indexesOf } = require('../../aux/index');
const Timeframe = require('./Timeframe');

/**
 * class with function for processing varies statement tables
 */
class Statement {
    /**
     * function to download tables
     * @param {string} url 
     * @return {string} string of html document
     */
     async _crawl(url) {
        // download raw html
        const { getHtml } = require('../../../models/index');
        const html = await getHtml(url);
        logger.trace({ 'marketwatch html input': { ticker: html } });
        return html;
    }

    /**
     * local function to parse a string of only ONE table DOM tag into arrays of rows
     * @param {string} str a string of one table
     * @return {array} table in terms of 2d array
     */
     _parseTable (str) {
        const result = [];
        try {
            // select only one table
            const table = xpath.fromPageSource(str).findElements('//table[*][1]');
            logger.trace({ 'marketwatch DOM _parseTable': { ticker: table.toString() } });

            const trs = xpath.fromNode(table).findElements('//tr');
            for (const tr of trs) {
                const processedRow = [];
                const leafNodes = xpath.fromNode(tr).findElements('//*[not(.//*)]'); // get leaf nodes
                for (const node of leafNodes) {
                    let value = node.getText();
                    // Financial format: '(1,000B)' to Math format: '-1000B'
                    value = finToMathFormat(value);
                    // Convert to million base: '1B' to '1000'
                    value = toMilBase(value);
                    // Conver to number type if possible, otherwise return itself
                    value = tryParseFloat(value);
                    processedRow.push(value);
                }
                result.push(processedRow);
            }
        } catch (err) {
            throw new customErrors.APIError('_parseTable Error', err.toString());
        }
        return result;
    }

    /**
     * local function to query the currency of tables
     * header > .small
     * @param {string} str a DOM
     * @return {string} currency
     */
     _findCurrency (str) {
        let currency = '';
        try {
            const nodes = xpath.fromPageSource(str).findElements('//header//*[@class="small"]');
            logger.trace({ 'marketwatch DOM _findCurrency': { ticker: nodes.toString() } });
            for (const node of nodes) {
                const finds = node.getText().match(/([A-Z]{3})/g);
                if (finds.length > 0) {
                    currency = finds[0];
                    break;
                }
            }
        } catch (err) {
            throw new customErrors.APIError('_findCurrency Error', err.toString());
        }
        return currency;
    }

    /**
     * local aux function to convert a table, which is in terms of arrays, into an Object of objects
     * e.g. [[DATE, DATE, DATE...], [header, data, data,...], [header, data, data,...], [header, data, data,...]]
     * {{DATE: {header: data, header: data, header: data,...}}, {DATE: {header: data, header: data, header: data,..}}}
     * @param {Array} table a 2d array repsentating rows of a table
     * @return {Object} object of objects
     */
    _conversion(table) {
        table = transpose(table);
        const result = {};
        if (table.length > 1 && table[0].length > 0) {
            const header = table[0];
            const rows = table.slice(1);
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
     * local aux function to convert a table, which is in terms of arrays, into an Object of objects
     * TTM is the sum of the previous 4 quarters
     * e.g. [[DATE, DATE, DATE...], [header, data, data,...], [header, data, data,...], [header, data, data,...]]
     * to: {{DATE: {header: data, header: data, header: data,...}}, {DATE: {header: data, header: data, header: data,...}}}
     * @param {Array} table a 2d array repsentating rows of a table
     * @param {Array} exceptions keywords to skip the TTM summation 
     * @return {Object} object of objects
     */
    _conversionTTM(table, exceptions = ['Growth', 'Yield', 'Change', 'Margin']) {
        const firstRow = table[0];
        const currentColIndex = firstRow.length - 1; // assume last column is current date
        const currentDate = firstRow[currentColIndex];
        const rows = table.slice(1, table.length - 1);
        const dict = {};
        // Value to check the whole column of the currentDate is ready
        let isReady = false;
        let prevValue = (rows.length > 0) ? rows[0][currentColIndex] : null;
        for (const row of rows) {
            const key = row[0];
            if (!isReady && prevValue != row[currentColIndex]) {
                isReady = true;
            }
            prevValue = row[currentColIndex];
            if (exceptions.some( ex => key.indexOf(ex) != -1)) {
                continue;
            }
            const quarters = (row.length > 3) ? row.slice(row.length - 4) : [];
            const sumTTM = quarters.reduce((prev, current) => {return (current)? prev + current : prev;}, 0);
            dict[key] = (sumTTM)? tryParseFloat(sumTTM) : sumTTM;
        }

        const result = {};
        result[currentDate] = dict;
        return (isReady) ? result : {};
    }
}

/**
 * class for Estimates in marketwatch
 */
 class Estimates extends Statement {
    /**
     * constructor to define table names for estimates
     */
    constructor() {
        super();
        this._tableNames = {
            0: 'Yearly Numbers Estimates',
            1: 'Quarterly Numbers Actuals',
            2: 'Quarterly Numbers Estimates',
        };
    }
    /**
     * Function to get url
     * @param {string} ticker 
     * @return {string} url 
     */
    _url(ticker) {
        return `https://www.marketwatch.com/investing/stock/${ticker}/analystestimates?mod=mw_quote_tab`;
    } 

    /**
     * local function to parse html
     * @param {string} html estimates web
     * @return {object} object of tables, where tables are in terms of arrays
     */
    _parseHtml(html) {
        const dict = {};
        try {
            // Replace ill-format from the website
            html = html.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
            const tables = xpath.fromPageSource(html).findElements('//div[@class="element__body"]/table');

            logger.debug({ 'marketwatch Estimates DOM table': { ticker: tables.toString() } });
            for (let i = 0; i < tables.length; i++) {
                const table = tables[i];
                dict[this._tableNames[i]] = (table)? super._parseTable(table.toString()) : [];
            }
        } catch (err) {
            throw new customErrors.APIError('_parseHtml Error', err.toString());
        }
        return dict;
    }

    /**
     * Get all estimates from crawlEstimates() in terms of object
     * @param {string} ticker 
     * @return {object} object of objects
     */
    async getEstimates(ticker) {
        // download
        const html = await super._crawl(this._url(ticker));
        // get dict of raw tables 
        const dict = (html)? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table in terms of array
            const table = dict[key];
            // transpose table and convert to dict 
            dict[key] = (table) ? super._conversion(table) : {};
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
        // download
        const html = await super._crawl(this._url(ticker));
        // get dict of raw tables 
        const dict = (html)? this._parseHtml(html) : {};
        const tableNames = this._tableNames;
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
        const table0 = dict[tableNames[0]];
        if (table0) {
            const currentYear = _findCururentYear(table0[0]); // locate current year
            const orgdict0 = super._conversion(table0); // transpose table and convert to dict 
            const newdict0 = {}; // reduce the org dict to current year
            newdict0[currentYear] = orgdict0[currentYear];
            dict[tableNames[0]] = newdict0;
        }

        const table1 = dict[tableNames[1]];
        if (table1) {
            const lastQuarter = table1[0][table1[0].length - 1]; // locate last quarter        
            const orgdict1 = super._conversion(table1); // transpose table and convert to dict 
            const newdict1 = {}; // reduce the org dict to last quarter
            newdict1[lastQuarter] = orgdict1[lastQuarter];
            dict[tableNames[1]] = newdict1;
        }

        const table2 = dict[tableNames[2]];
        if (table2) {
            const nextQuarter = table2[0][1]; // locate next quarter        
            const orgdict2 = super._conversion(table2); // transpose table and convert to dict 
            const newdict2 = {}; // reduce the org dict to next quarter
            newdict2[nextQuarter] = orgdict2[nextQuarter];
            dict[tableNames[2]] = newdict2;
        }

        logger.info({ 'marketwatch getCurrentEstimates': { ticker: dict } });
        return dict;
    }
}

/**
 * class for Cash Flow page in marketwatch
 */
class CashFlow extends Statement {
    /**
     * constructor to define table names for Cash Flow
     */
    constructor() {
        super();
        this._tableNames = {
            0: 'Operating Activities',
            1: 'Investing Activities',
            2: 'Financing Activities',
        };
        // table 5 =  Operating Activities, table 6 =  Investing Activities, table 7 =  Financing Activities 
        this._targetIndexes = [4, 5, 6];
    }
    /**
     * Function to get url
     * @param {string} ticker 
     * @param {Timeframe} timeframe default TTM
     * @return {string} url 
     */
    _url(ticker, timeframe = Timeframe.TTM) {
        switch (timeframe) {
            case Timeframe.ANNUAL:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/cash-flow`;
            case Timeframe.QUARTER:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/cash-flow/quarter`;
            case Timeframe.TTM:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/cash-flow/quarter`;
            default:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/cash-flow`;
        }
    }

    /**
     * local function to parse html
     * @param {string} html estimates web
     * @return {object} object of tables, where tables are in terms of arrays
     */
    _parseHtml(html) {
        const dict = {};
        // Replace ill-format from the website
        html = html.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
        const indexes1 = indexesOf(html, '<table');
        const indexes2 = indexesOf(html, '</table>');

        for (let i = 0; i < this._targetIndexes.length; i++) {
            const j = this._targetIndexes[i];
            const tableStr = html.substring(indexes1[j], indexes2[j] + 8);
            logger.debug({ 'marketwatch _parseHtml': tableStr.toString() });
            const table = (tableStr)? super._parseTable(tableStr) : [];
            // first and last column are dummy on this website's tables, so remove it
            dict[this._tableNames[i]] = table.map(row => row.slice(1, row.length - 1));
        }
        return dict;
    }

    /**
     * Get cash flow in terms of object
     * @param {string} ticker 
     * @param {Timeframe} timeframe default TTM
     * @return {object} object of objects
     */
    async getCashFlow(ticker, timeframe = Timeframe.TTM) {        
        // download
        const html = await super._crawl(this._url(ticker));
        // get dict of raw tables 
        const dict = (html)? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table, which is in terms of array data type
            const table = dict[key];

            // transpose table and convert to dict 
            if (timeframe == Timeframe.TTM) {
                dict[key] = (table) ? super._conversionTTM(table, ['Growth', 'Yield', 'Change', '/']) : {};
            } else {
                dict[key] = (table) ? super._conversion(table) : {};
            }
        }
        // Add currency info
        dict['Currency'] = (html)? super._findCurrency(html) : '';

        logger.info({ 'marketwatch getCashFlow': { ticker: dict } });
        return dict;
    }
}

/**
 * class for Income statement page in marketwatch
 */
 class IncomeStat extends Statement {
    /**
     * constructor to define table names for Cash Flow
     */
    constructor() {
        super();
        this._tableNames = {
            0: 'Income Statement',
        };
        // table 5 = income statement
        this._targetIndexes = [4];
    }
    /**
     * Function to get url
     * @param {string} ticker 
     * @param {Timeframe} timeframe default TTM
     * @return {string} url 
     */
    _url(ticker, timeframe = Timeframe.TTM) {
        switch (timeframe) {
            case Timeframe.ANNUAL:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/income`;
            case Timeframe.QUARTER:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/income/quarter`;
            case Timeframe.TTM:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/income/quarter`;
            default:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/income`;
        }
    }

    /**
     * local function to parse html
     * @param {string} html estimates web
     * @return {object} object of tables, where tables are in terms of arrays
     */
    _parseHtml(html) {
        const dict = {};
        // Replace ill-format from the website
        const indexes1 = indexesOf(html, '<table');
        const indexes2 = indexesOf(html, '</table>');

        for (let i = 0; i < this._targetIndexes.length; i++) {
            const j = this._targetIndexes[i];
            let tableStr = html.substring(indexes1[j], indexes2[j] + 8);
            tableStr = tableStr.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
            logger.debug({ 'marketwatch _parseHtml': tableStr.toString() });
            const table = (tableStr)? super._parseTable(tableStr) : [];
            // first and last column are dummy on this website's tables, so remove it
            dict[this._tableNames[i]] = table.map(row => row.slice(1, row.length - 1));
        }
        return dict;
    }

    /**
     * Get all income statement in terms of object
     * @param {string} ticker 
     * @param {Timeframe} timeframe default TTM
     * @return {object} object of objects
     */
    async getIncomeStat(ticker, timeframe = Timeframe.TTM) {
        // download
        const html = await super._crawl(this._url(ticker));
        // get dict of raw tables 
        const dict = (html)? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table, which is in terms of array data type
            const table = dict[key];

            // transpose table and convert to dict 
            if (timeframe == Timeframe.TTM) {
                dict[key] = (table) ? super._conversionTTM(table, ['Growth', 'Yield', 'Change', 'Margin']) : {};
            } else {
                dict[key] = (table) ? super._conversion(table) : {};
            }
        }
        // Add currency info
        dict['Currency'] = (html)? super._findCurrency(html) : '';

        logger.info({ 'marketwatch getIncomeStat': { ticker: dict } });
        return dict;
    }
}

/**
 * class for Balance Sheet page in marketwatch
 */
 class BalanceSheet extends Statement {
    /**
     * constructor to define table names for Cash Flow
     */
    constructor() {
        super();
        this._tableNames = {
            0: 'Assets',
            1: `Liabilities & Shareholders' Equity`,
        };
        // table 5 = Assets table, table 6 = Liabilities & Shareholders' Equity
        this._targetIndexes = [4, 5];
    }
    /**
     * Function to get url
     * @param {string} ticker 
     * @param {Timeframe} timeframe default TTM
     * @return {string} url 
     */
    _url(ticker, timeframe = Timeframe.TTM) {
        switch (timeframe) {
            case Timeframe.ANNUAL:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/balance-sheet`;
            case Timeframe.QUARTER:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/balance-sheet/quarter`;
            case Timeframe.TTM:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/balance-sheet/quarter`;
            default:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/balance-sheet`;
        }
    }

    /**
     * local function to parse html
     * @param {string} html estimates web
     * @return {object} object of tables, where tables are in terms of arrays
     */
    _parseHtml(html) {
        const dict = {};
        // Replace ill-format from the website
        const indexes1 = indexesOf(html, '<table');
        const indexes2 = indexesOf(html, '</table>');

        for (let i = 0; i < this._targetIndexes.length; i++) {
            const j = this._targetIndexes[i];
            let tableStr = html.substring(indexes1[j], indexes2[j] + 8);
            tableStr = tableStr.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
            logger.debug({ 'marketwatch _parseHtml': tableStr.toString() });
            const table = (tableStr)? super._parseTable(tableStr) : [];
            // first and last column are dummy on this website's tables, so remove it
            dict[this._tableNames[i]] = table.map(row => row.slice(1, row.length - 1));
        }

        return dict;
    }

    /**
     * Get all Balance Sheet in terms of object
     * @param {string} ticker 
     * @param {Timeframe} timeframe default TTM
     * @return {object} object of objects
     */
    async getBalanceSheet(ticker, timeframe = Timeframe.TTM) {
        // download
        const html = await super._crawl(this._url(ticker));
        // get dict of raw tables 
        const dict = (html)? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table, which is in terms of array data type
            const table = dict[key];
            // transpose table and convert to dict 
            dict[key] = (table) ? super._conversion(table) : {};
        }
        // Add currency info
        dict['Currency'] = (html)? super._findCurrency(html) : '';

        logger.info({ 'marketwatch getBalanceSheet': { ticker: dict } });
        return dict;
    }
}

module.exports = {
    estimates: new Estimates(),
    cashFlow: new CashFlow(),
    incomeStat: new IncomeStat(),
    balanceSheet: new BalanceSheet()
};
