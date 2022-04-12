const { tryParseFloat } = require('../../aux/index');
/**
 * Class for calculation
 */
class Calculation {
    /**
     * constructor to initialize objects by tables from Marketwatch
     * @param {Object} BS balance sheet
     * @param {Object} IS Income Statement
     * @param {Object} CF Cash Flow
     */
    constructor(BS, IS, CF) {
        this._BS = BS;
        this._IS = IS;
        this._CF = CF;

        this._ISheader = ['Income Statement'];
        this._BSheader = ['Assets', `Liabilities & Shareholders' Equity`];
        this._CFheader = ['Operating Activities', 'Investing Activities', 'Financing Activities'];
    }

    /**
     * Local function to check if all the data are available
     * @return {boolean}
     */
    _isValid() {
        if (!this._BS || !this._CF || !this._IS) {
            return false;
        } else if (!this._BS['Price (USD)'] && !this._IS['Price (USD)'] && !this._CF['Price (USD)']) {
            return false;
        } else if (!this._BS['Data Currency'] && !this._IS['Data Currency'] && !this._CF['Data Currency']) {
            return false;
        }

        if (Object.keys(this._BS).length == 0 ||
            Object.keys(this._CF).length == 0 ||
            Object.keys(this._IS).length == 0) {
            return false;
        }

        for (const h of this._ISheader) {
            if (!this._IS[h]) {
                return false;
            }
        }
        for (const h of this._BSheader) {
            if (!this._BS[h]) {
                return false;
            }
            if (!this._BS[h]['Average TTM']) {
                return false;
            }
        }
        for (const h of this._CFheader) {
            if (!this._CF[h]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Local function to locate the latest data
     * @return {Object}
     */
    _prepareData() {
        let data = {};

        data['Price'] = this._BS['Price (USD)'] || this._IS['Price (USD)'] || this._CF['Price (USD)'];
        data['Currency'] = this._BS['Data Currency'] || this._IS['Data Currency'] || this._CF['Data Currency'];

        for (const header of this._ISheader) {
            const keys = Object.keys(this._IS[header]);
            const target = keys.reduce(
                (prev, curr) => {return (new Date(curr) > new Date(prev)) ? curr : prev; },
                -8640000000000000
            );
            data = { ...data, ...this._IS[header][target] };
        }
        for (const header of this._BSheader) {
            const keys = Object.keys(this._BS[header]);
            const target = keys.reduce(
                (prev, curr) => { return (new Date(curr) > new Date(prev)) ? curr : prev; },
                -8640000000000000
            );
            data = { ...data, ...this._BS[header][target] };
            data = { ...data, ...this._BS[header]['Average TTM'][target] };
        }
        for (const header of this._CFheader) {
            const keys = Object.keys(this._CF[header]);
            const target = keys.reduce(
                (prev, curr) => { return (new Date(curr) > new Date(prev)) ? curr : prev; },
                -8640000000000000
            );
            data = { ...data, ...this._CF[header][target] };
        }
        return data;
    }

    /**
     * Calulcate various ratio if Currency is USD
     * @return {Object}
     */
    calculate() {
        if (!this._isValid()) {
            return result;
        }
        const result = {};
        const data = this._prepareData();

        // Market Capitalization
        if (data['Diluted Shares Outstanding'] && data['Price']) {
            result['Market Capitalization'] = data['Price'] * data['Diluted Shares Outstanding'];
            data['Market Capitalization'] = result['Market Capitalization'];
        }
        // EV
        if (data['Market Capitalization']) {
            data['EV'] = data['Market Capitalization'] +
                data['Preferred Stock (Carrying Value)'] +
                data['ST Debt & Current Portion LT Debt'] +
                data['Long-Term Debt'] +
                data['Accumulated Minority Interest'] -
                data['Cash & Short Term Investments'];
            result['EV'] = data['EV'];
        }
        // Calculate PE Ratio
        if (data['Price'] && data['EPS (Diluted)']) {
            result['PE ratio'] = data['Price'] / data['EPS (Diluted)'];
        }
        // Calculate P/OCF Ratio
        if (data['Market Capitalization'] && data['Net Operating Cash Flow']) {
            result['P/OCF Ratio'] = result['Market Capitalization'] / data['Net Operating Cash Flow'];
        }
        // Calculate EV/Sales Ratio
        if (data['EV'] && data['Sales/Revenue']) {
            result['EV/Sales Ratio'] = result['EV'] / data['Sales/Revenue'];
        }
        // Calculate EV/EBITDA Ratio
        if (data['EV'] && data['EBITDA']) {
            result['EV/EBITDA ratio'] = result['EV'] / data['EBITDA'];
        }
        // Calculate EV/EBIT Ratio
        if (data['EV'] && data['EBITDA'] && data['Depreciation & Amortization Expense']) {
            result['EV/EBIT Ratio'] = result['EV'] / (data['EBITDA'] - data['Depreciation & Amortization Expense']);
        }
        // Calculate EV/FCF Ratio
        if (data['EV'] && data['Free Cash Flow']) {
            result['EV/FCF Ratio'] = result['EV'] / data['Free Cash Flow'];
        }
        // Calculate Asset Turnover: Revenue/Average total asset (4 quarters) 
        if (data['Sales/Revenue'] && data['Average Total Assets']) {
            result['Asset Turnover'] = data['Sales/Revenue'] / data['Average Total Assets'];
        }
        // calculate cash conversion cycle = CCC =DIO + DSO - DPO
        if (data['Average Inventories'] && data['Cost of Goods Sold (COGS) incl. D&A'] && data['Sales/Revenue'] &&
            data['Average Total Accounts Receivable'] && data['Average Accounts Payable']) {
            const DIO = data['Average Inventories'] / data['Cost of Goods Sold (COGS) incl. D&A'] * 365;
            const revenuePerDay = data['Sales/Revenue'] / 365;
            const DSO = data['Average Total Accounts Receivable'] / revenuePerDay;
            const cogsPerDay = data['Cost of Goods Sold (COGS) incl. D&A'] / 365;
            const DPO = data['Average Accounts Payable'] / cogsPerDay;
            result['Cash Conversion'] = DIO + DSO - DPO;
        }
        // Calculate fcfmargin: Free Cash Flow divided by Total Revenue
        if (data['Sales/Revenue'] && data['Free Cash Flow']) {
            result['FCF Margin'] = data['Free Cash Flow'] / data['Sales/Revenue'];
        }
        // Calculate total debt/ebitda
        if (data['ST Debt & Current Portion LT Debt'] && data['Long-Term Debt'] && data['EBITDA']) {
            const debt = data['ST Debt & Current Portion LT Debt'] + data['Long-Term Debt'];
            result['Debt/EBITDA Ratio'] = debt / data['EBITDA'];
        }
        // Calculate total debt/fcf
        if (data['ST Debt & Current Portion LT Debt'] && data['Long-Term Debt'] && data['Free Cash Flow']) {
            const debt = data['ST Debt & Current Portion LT Debt'] + data['Long-Term Debt'];
            result['Debt/FCF Ratio'] = debt / data['Free Cash Flow'];
        }
        // Calculate EBIT
        if (data['Sales/Revenue'] && data['Cost of Goods Sold (COGS) incl. D&A'] && data['SG&A Expense']) {
            data['EBIT'] = data['Sales/Revenue'] - data['Cost of Goods Sold (COGS) incl. D&A'] - data['SG&A Expense'];
            result['EBIT'] = data['EBIT'];
        }
        // Calculate Interest Coverage Ratio
        // (Sales/Revenue-Cost of Goods Sold (COGS) incl. D&A - SG&A Expense)/Interest Expense
        if (data['EBIT'] && data['Interest Expense']) {
            result['Interest Coverage Ratio'] = data['EBIT'] / data['Interest Expense'];
        }
        // Calculate earning yield
        if (data['EPS (Diluted)'] && data['Price']) {
            result['Earnings yeild'] = data['EPS (Diluted)'] / data['Price'];
        }
        // Calculate Dividend Yield
        // annual dividend per share / (market cap / outstanding shares)
        if (data['Market Capitalization'] && data['Cash Dividends Paid - Total'] &&
            data['Diluted Shares Outstanding']) {
            const divided = data['Cash Dividends Paid - Total'] / data['Diluted Shares Outstanding'] * -1;
            result['Dividend Yield'] = divided / (data['Market Capitalization'] / data['Diluted Shares Outstanding']);
        }

        // Calculate Payout ratio
        if (data['EPS (Diluted)'] && data['Cash Dividends Paid - Total'] && data['Diluted Shares Outstanding']) {
            const divided = data['Cash Dividends Paid - Total'] / data['Diluted Shares Outstanding'] * -1;
            result['Payout Ratio'] = divided / data['EPS (Diluted)'];
        }
        // Calculate FCF Yield
        if (data['Market Capitalization'] && data['Free Cash Flow']) {
            result['FCF Yield'] = data['Free Cash Flow'] / data['Market Capitalization'];
        }
        // // Calculate buybackyield : (Shares before - Shares now) / Shares now
        if (data['Change Diluted Shares Outstanding']) {
            result['Buyback Yield / Dilution'] = data['Change Diluted Shares Outstanding'];
        }
        // Calculate total shareholder return
        if (result['Dividend Yield'] && result['Buyback Yield / Dilution']) {
            result['Total Shareholder Return'] = result['Dividend Yield'] + result['Buyback Yield / Dilution'];
        }
        return Object.entries(result).reduce((p, [k, v]) => ({ ...p, [k]: tryParseFloat(result[k]) }), {});
    }
}

module.exports = Calculation;
