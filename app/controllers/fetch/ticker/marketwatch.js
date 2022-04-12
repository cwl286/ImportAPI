const xpath = require('xpath-html');
const { logger } = require('../../logger/index');
const { customErrors } = require('../../error/index');
const { tryParseFloat, toMilBase, finToMathFormat, arrayToObject, indexesOf } = require('../../aux/index');
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
    _parseTable(str) {
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
        return (result.length > 0) ? result : [];
    }

    /**
     * local function to find latest price 
     * header > .small
     * @param {string} html a DOM
     * @return {number} price
     */
    _findPrice(html) {
        let price = '';
        try {
            const query = '//div[@class="intraday__data"]//*[@class="value"]';
            const nodes = xpath.fromPageSource(html).findElements(query);
            logger.trace({ 'marketwatch DOM _findCurrency': { ticker: nodes.toString() } });
            for (const node of nodes) {
                const val = tryParseFloat(node.getText());
                if (!Number.isNaN(val)) {
                    price = val;
                    break;
                }
            }
        } catch (err) {
            throw new customErrors.APIError('_findPrice Error', err.toString());
        }
        return price;
    }

    /**
     * local function to query the currency of tables
     * header > .small
     * @param {string} html a DOM
     * @return {string} currency
     */
    _findCurrency(html) {
        let currency = '';
        try {
            const nodes = xpath.fromPageSource(html).findElements('//header//*[@class="small"]');
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
     * Calculate TTM is the sum of the previous 4 quarters
     * From: 
     * ['1a', '1b', '1c', '1d', '1e', '1f'],
     * ['2a', 2, 2, 2, 2, 1],
     * ['3a', 3, 3, 3, 3, 1],
     * ['4a', 4, 4, 4, 4, 1]
     * To: 
     * {1e: {2a: 8. 3a: 9, 4a: 16}}
     * {1f: {2a: 7. 3a: 8, 4a: 15}}
     * @param {Array} table a 2d array repsentating rows of a table
     * @param {Array} skips keywords to skip the TTM summation 
     * @param {Array} expections keywords to retain the current date's value
     * @return {Object} object of objects
     */
    _conversionTTM(table, skips = ['Growth', 'Yield', 'Change', 'Margin'], expections = []) {
        if (!table || table.length === 0) {
            return {};
        }
        const oldHeader = table[0];
        const oldRows = table.slice(1, table.length - 1);

        const newTable = [];
        const newHeader = [];
        for (let i = oldHeader.length - 1; i - 3 >= 1; i--) {
            newHeader.unshift(oldHeader[i]);
        }
        newHeader.unshift('');
        newTable.push(newHeader);

        // Aux dicts help check the whole column is ready as sometimes the data is not ready
        const auxDict = {};
        const isReadyDict = {};
        newHeader.forEach(h => isReadyDict[h] = false);

        for (const oldRow of oldRows) {
            const name = oldRow[0];
            let parsedRow = [];   // Create new rows
            if (skips.some(ex => name.indexOf(ex) != -1)) {
                // skeip some data invalid for TTM calculation
                continue; 
            }
            for (let i = oldRow.length - 1; i - 3 >= 1; i--) {
                if (expections.length > 0 && expections.some(ex => name.indexOf(ex) != -1)) {
                    // some data is unsutiable to TTM calculation, just add it
                    parsedRow.unshift(oldRow[i]);
                    continue; 
                }
                // Check if data are ready spaghetti code xD
                if (!auxDict[oldHeader[i]]) {
                    // init aux dict
                    auxDict[oldHeader[i]] = oldRow[i];
                } else if (!isReadyDict[oldHeader[i]] && auxDict[oldHeader[i]] != oldRow[i]) {
                    isReadyDict[oldHeader[i]] = true;
                } 
                auxDict[oldHeader[i]] = oldRow[i];

                const quarters = oldRow.slice(i - 3, i + 1); // 4 quarters
                const sum = quarters.reduce((prev, current) => { return (current) ? prev + current : prev; }, 0);
                parsedRow.unshift(tryParseFloat(sum));
            }
            parsedRow.unshift(name);
            newTable.push(parsedRow);
        }

        const result = arrayToObject(newTable);
        // xD
        for (const key in isReadyDict) {
            if (!isReadyDict[key]) {
                delete result[key];
            }
        }
        return result;
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
                dict[this._tableNames[i]] = (table) ? super._parseTable(table.toString()) : [];
            }
        } catch (err) {
            throw new customErrors.APIError('Estimates _parseHtml Error', err.toString());
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
        const dict = (html) ? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table in terms of array
            const table = dict[key];
            // convert a array of arrays into an object of objects 
            dict[key] = (table) ? arrayToObject(table) : {};
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
        const dict = (html) ? this._parseHtml(html) : {};
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
            const orgdict0 = arrayToObject(table0); // convert a array of arrays into an object of objects 
            const newdict0 = {}; // reduce the org dict to current year
            newdict0[currentYear] = orgdict0[currentYear];
            dict[tableNames[0]] = newdict0;
        }

        const table1 = dict[tableNames[1]];
        if (table1) {
            const lastQuarter = table1[0][table1[0].length - 1]; // locate last quarter        
            const orgdict1 = arrayToObject(table1); // convert a array of arrays into an object of objects 
            const newdict1 = {}; // reduce the org dict to last quarter
            newdict1[lastQuarter] = orgdict1[lastQuarter];
            dict[tableNames[1]] = newdict1;
        }

        const table2 = dict[tableNames[2]];
        if (table2) {
            const nextQuarter = table2[0][1]; // locate next quarter        
            const orgdict2 = arrayToObject(table2); // convert a array of arrays into an object of objects 
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
     * return null if no table
     */
    _parseHtml(html) {
        const dict = {};
        // Replace ill-format from the website
        html = html.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
        const indexes1 = indexesOf(html, '<table');
        const indexes2 = indexesOf(html, '</table>');

        try {
            for (let i = 0; i < this._targetIndexes.length; i++) {
                const j = this._targetIndexes[i];
                const tableStr = html.substring(indexes1[j], indexes2[j] + 8);
                logger.debug({ 'marketwatch _parseHtml': tableStr.toString() });
                // set as null if not string
                const table = (tableStr) ? super._parseTable(tableStr) : [];
                // first and last column are dummy on this website's tables, so remove it
                dict[this._tableNames[i]] = table.map(row => row.slice(1, row.length - 1));
            }
        } catch (err) {
            throw new customErrors.APIError('CashFlow _parseHtml Error', err.toString());
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
        const dict = (html) ? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table, which is in terms of array data type
            const table = dict[key];
            if (timeframe == Timeframe.TTM) {
                // convert a array of arrays into an object of objects 
                dict[key] = super._conversionTTM(table, ['Growth', 'Yield', 'Change', '/'], []);
            } else {
                dict[key] = arrayToObject(table);
            }
        }
        // Add currency info
        dict['Data Currency'] = (html) ? super._findCurrency(html) : '';
        dict['Price (USD)'] = (html) ? super._findPrice(html) : '';

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
            case Timeframe.TTM_IS:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/income/quarter`;
            default:
                return `https://www.marketwatch.com/investing/stock/${ticker}/financials/income`;
        }
    }

    /**
     * local function to parse html
     * @param {string} html estimates web
     * @return {object} object of tables, where tables are in terms of arrays
     * return dict of null if no table
     */
    _parseHtml(html) {
        const dict = {};
        // Replace ill-format from the website
        const indexes1 = indexesOf(html, '<table');
        const indexes2 = indexesOf(html, '</table>');
        try {
            for (let i = 0; i < this._targetIndexes.length; i++) {
                const j = this._targetIndexes[i];
                let tableStr = html.substring(indexes1[j], indexes2[j] + 8);
                tableStr = tableStr.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
                logger.debug({ 'marketwatch _parseHtml': tableStr.toString() });
                const table = (tableStr) ? super._parseTable(tableStr) : [];
                // first and last column are dummy on this website's tables, so remove it
                dict[this._tableNames[i]] = table.map(row => row.slice(1, row.length - 1));
            }
        } catch (err) {
            throw new customErrors.APIError('Incomestat _parseHtml Error', err.toString());
        }
        return dict;
    }

    
    /**
     * local aux function to convert a table, which is in terms of arrays, into an Object of objects
     * Calculate TTM is the sum of the previous 4 quarters
     * @param {Array} table a 2d array repsentating rows of a table
     * @param {Array} skips keywords to skip the TTM summation 
     * @param {Array} expections keywords to retain the current date's value
     * @return {Object} object of objects
     */
    _conversionTTM_IS(table, skips = ['Growth', 'Yield', 'Change', 'Margin'], expections = []) {
        if (!table || table.length === 0) {
            return {};
        }
        const oldHeader = table[0];
        const oldRows = table.slice(1, table.length - 1);

        const newTable = [];
        const newHeader = [];
        for (let i = oldHeader.length - 1; i - 3 >= 1; i--) {
            newHeader.unshift(oldHeader[i]);
        }
        newHeader.unshift('');
        newTable.push(newHeader);

        // Aux dicts help check the whole column is ready as sometimes the data is not ready
        const auxDict = {};
        const isReadyDict = {};
        newHeader.forEach(h => isReadyDict[h] = false);

        for (const oldRow of oldRows) {
            const name = oldRow[0];
            const parsedRow = [];   // Create new rows
            if (skips.some(ex => name.indexOf(ex) != -1)) {
                // skeip some data invalid for TTM calculation
                continue; 
            }
            // spaghetti xD
            const specialRow = [];
            for (let i = oldRow.length - 1; i - 3 >= 1; i--) {
                if (expections.length > 0 && expections.some(ex => name.indexOf(ex) != -1)) {
                    // some data is unsutiable to TTM calculation, just add it
                    parsedRow.unshift(oldRow[i]);
                    // also calculate average 
                    const quarters = oldRow.slice(i - 3, i + 1); // 4 quarters
                    const avg = (quarters[0] - quarters[quarters.length -1]) / quarters[0];
                    specialRow.unshift(avg);
                    continue; 
                }
                // Check if data are ready spaghetti code xD
                if (!auxDict[oldHeader[i]]) {
                    // init aux dict
                    auxDict[oldHeader[i]] = oldRow[i];
                } else if (!isReadyDict[oldHeader[i]] && auxDict[oldHeader[i]] != oldRow[i]) {
                    isReadyDict[oldHeader[i]] = true;
                } 
                auxDict[oldHeader[i]] = oldRow[i];

                const quarters = oldRow.slice(i - 3, i + 1); // 4 quarters
                const sum = quarters.reduce((prev, current) => { return (current) ? prev + current : prev; }, 0);
                parsedRow.unshift(tryParseFloat(sum));
            }
            parsedRow.unshift(name);
            newTable.push(parsedRow);
            if (specialRow.length > 0) {
                specialRow.unshift(`Change ${name}`);
                newTable.push(specialRow);
            }
        }

        let result = arrayToObject(newTable);
        // xD
        for (const key in isReadyDict) {
            if (!isReadyDict[key]) {
                delete result[key];
            }
        }
        return result;
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
        const dict = (html) ? this._parseHtml(html) : {};
        for (const key in dict) {
            // get table, which is in terms of array data type
            const table = dict[key];
            // convert a array of arrays into an object of objects
            if (timeframe == Timeframe.TTM) {
                dict[key] = super._conversionTTM(table, ['Growth', 'Yield', 'Change', 'Margin'], ['Outstanding']);
            } else if (timeframe == Timeframe.TTM_IS) {
                dict[key] = this._conversionTTM_IS(table, ['Growth', 'Yield', 'Change', 'Margin'], ['Outstanding']);
            } else {
                dict[key] = arrayToObject(table);
            }
        }
        // Add currency info
        dict['Data Currency'] = (html) ? super._findCurrency(html) : '';
        dict['Price (USD)'] = (html) ? super._findPrice(html) : '';

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
            case Timeframe.TTM_BS:
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

        try {
            for (let i = 0; i < this._targetIndexes.length; i++) {
                const j = this._targetIndexes[i];
                let tableStr = html.substring(indexes1[j], indexes2[j] + 8);
                tableStr = tableStr.replaceAll('aria=label', 'xxx').replaceAll('<div></div>', '</div></div>');
                logger.debug({ 'marketwatch _parseHtml': tableStr.toString() });
                const table = (tableStr) ? super._parseTable(tableStr) : [];
                // first and last column are dummy on this website's tables, so remove it
                dict[this._tableNames[i]] = table.map(row => row.slice(1, row.length - 1));
            }
        } catch (err) {
            throw new customErrors.APIError('Balancesheet _parseHtml Error', err.toString());
        }

        return dict;
    }

    /**
     * Calculate the following average TTM data for 'Calculation.js'
     * 'Average Total Assets', 'Average Total Accounts Receivable', 'Average Inventories', 
     * 'Average Accounts Payable'
     * @param {Array} table - array of arrays
     * @return {Object} object of average data
     */
    _calculateAvergae(table) {
        const avg = {};
        const items = ['Total Assets', 'Total Accounts Receivable', 'Inventories', 'Accounts Payable'];
        table = super._conversionTTM(table);
        for (const date in table) {
            avg[date] = {};
            const subObj = table[date];
            items.forEach(item => {
                if (subObj[item]) {
                    avg[date][`Average ${item}`] = tryParseFloat(subObj[item] / 4);
                }});
        }
        return avg;
    }

    /**
     * Get all Balance Sheet in terms of object
     * @param {string} ticker 
     * @param {Timeframe} timeframe defau
     * lt TTM
     * @return {object} object of objects
     */
    async getBalanceSheet(ticker, timeframe = Timeframe.TTM) {
        // download
        const html = await super._crawl(this._url(ticker));
        // get dict of raw tables 
        const dict = (html) ? this._parseHtml(html) : {};

        for (const date in dict) {
            // get table, which is in terms of array data type
            const table = dict[date];
            if (!table) {
                continue;
            }
            // convert a array of arrays into an object of objects 
            dict[date] = arrayToObject(table);
            if  (timeframe == Timeframe.TTM_BS) {
                const avg = this._calculateAvergae(table);
                dict[date]['Average TTM'] = {...dict[date]['Average TTM'], ...avg};
            }
        }
        // Add currency info
        dict['Data Currency'] = (html) ? super._findCurrency(html) : '';
        dict['Price (USD)'] = (html) ? super._findPrice(html) : '';

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
