const { APIError } = require('../../error/index');
const { Timeframe } = require('../../fetch/ticker/index');

/**
 * Query ratio data from several websites
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT). 
 * @return {string}
 */
const queryRatio = async function (ticker) {
    const { getFinviz, getStockAnalysis, getShortVolume, estimates} = require('../../fetch/ticker/index');
    const promise1 = new Promise((resolve) => resolve(getFinviz(ticker)));
    const promise2 = new Promise((resolve) => resolve(getStockAnalysis(ticker)));
    const promise3 = new Promise((resolve) => resolve(getShortVolume(ticker)));
    const promise4 = new Promise((resolve) => resolve(estimates.getEstimates(ticker)));

    const responses = await Promise.all([promise1, promise2, promise3, promise4])
        .catch(err => {
            throw new APIError(`queryRatio ${err}`);
        });

    const keys = ['finviz', 'stockanalysis', 'shortvolume', 'marketwatch'];
    let result = {};
    for (let i = 0; i < responses.length; i++) {
        const dict = {};
        dict[keys[i]] = responses[i];
        result = { ...result, ...dict };
    }
    return result;
};

/**
 * Query current ratio data from several websites
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT). 
 * @return {string}
 */
const queryCurrentRatio = async function (ticker) {
    const { getFinviz, getStockAnalysisLatest, getShortVolumeLatest, estimates } = require('../../fetch/ticker/index');
    const promise1 = new Promise((resolve) => resolve(getFinviz(ticker)));
    const promise2 = new Promise((resolve) => resolve(getStockAnalysisLatest(ticker)));
    const promise3 = new Promise((resolve) => resolve(getShortVolumeLatest(ticker)));
    const promise4 = new Promise((resolve) => resolve(estimates.getCurrentEstimates(ticker)));

    const responses = await Promise.all([promise1, promise2, promise3, promise4])
        .catch(err => {
            throw new APIError(`queryCurrentRatio ${err}`);
        });

    const keys = ['finviz', 'stockanalysis', 'shortvolume', 'marketwatch'];
    let result = {};
    for (let i = 0; i < responses.length; i++) {
        const dict = {};
        dict[keys[i]] = responses[i];
        result = { ...result, ...dict };
    }
    return result;
};

/**
 * Query profile data
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT). 
 * @return {string}
 */
const queryProfile = async function (ticker) {
    try {
        const { getProfile } = require('../../fetch/ticker/index');
        const data1 = await getProfile(ticker);
        return data1;
    } catch (err) {
        throw new APIError(`queryProfile ${err}`);
    }
};

/**
 * Query profile statements
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT).
 * @param {Timeframe} timeFrame
 * @return {string}
 */
const queryStatement = async function (ticker, timeFrame) {
    const { cashFlow, incomeStat, balanceSheet } = require('../../fetch/ticker/index');
    const promise1 = new Promise((resolve) => resolve(cashFlow.getCashFlow(ticker, timeFrame)));
    const promise2 = new Promise((resolve) => resolve(incomeStat.getIncomeStat(ticker, timeFrame)));
    const promise3 = new Promise((resolve) => resolve(balanceSheet.getBalanceSheet(ticker, timeFrame)));

    const responses = await Promise.all([promise1, promise2, promise3])
        .catch(err => {
            throw new APIError(`queryStatement ${err}`);
        });

    const keys = ['Cash Flow', 'Income Statement', 'Balance Sheet'];
    let result = {};
    for (let i = 0; i < responses.length; i++) {
        const dict = {};
        dict[keys[i]] = responses[i];
        result = { ...result, ...dict };
    }
    return result;
};

/**
 * Query profile statements
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT).
 * @param {Timeframe} timeFrame
 * @return {string}
 */
const queryCalculation = async function (ticker) {
    const { Calculation, cashFlow, incomeStat, balanceSheet } = require('../../fetch/ticker/index');
    const promise1 = new Promise((resolve) => resolve(cashFlow.getCashFlow(ticker, Timeframe.TTM_BS)));
    const promise2 = new Promise((resolve) => resolve(incomeStat.getIncomeStat(ticker, Timeframe.TTM_BS)));
    const promise3 = new Promise((resolve) => resolve(balanceSheet.getBalanceSheet(ticker, Timeframe.TTM_BS)));

    const responses = await Promise.all([promise1, promise2, promise3])
        .catch(err => {
            throw new APIError(`queryCalculation ${err}`);
        });

    const keys = ['Cash Flow', 'Income Statement', 'Balance Sheet'];
    let result = {};
    for (let i = 0; i < responses.length; i++) {
        const dict = {};
        dict[keys[i]] = responses[i];
        result = { ...result, ...dict };
    }
    // match the paramteres 
    result['Calculateion'] = await new Calculation(responses[2], responses[1], responses[0]).calculate();
    return result;
};

module.exports = {
    queryRatio: queryRatio,
    queryCurrentRatio: queryCurrentRatio,
    queryProfile: queryProfile,
    queryStatement: queryStatement,
    queryCalculation: queryCalculation,
};
