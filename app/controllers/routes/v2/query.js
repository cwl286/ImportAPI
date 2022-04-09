const { customErrors } = require('../../error/index');
const { Timeframe } = require('../../fetch/ticker/index');

/**
 * Query ratio data from several websites
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT). 
 * @return {string}
 */
const queryRatio = async function (ticker) {
    const { estimates, getFinviz, getStockAnalysis, getShortVolume } = require('../../fetch/ticker/index');     
    try {               
        return {
            finviz: await getFinviz(ticker),
            stockanalysis: await getStockAnalysis(ticker),
            shortvolume: await getShortVolume(ticker),
            marketwatch: await estimates.getEstimates(ticker),
        };
    } catch (err) {
        throw new customErrors.APIError(`queryRatio ${err}`);
    }
};

/**
 * Query current ratio data from several websites
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT). 
 * @return {string}
 */
const queryCurrentRatio = async function (ticker) {
    const { Estimates, getFinviz, getStockAnalysisLatest, getShortVolumeLatest } = require('../../fetch/ticker/index');
    try {        
        return {
            finviz: await getFinviz(ticker),
            stockanalysis: await getStockAnalysisLatest(ticker),
            shortvolume: await getShortVolumeLatest(ticker),
            marketwatch: await Estimates.getCurrentEstimates(ticker),
        };
    } catch (err) {
        throw new customErrors.APIError(`queryCurrentRatio ${err}`);
    }
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
        throw new customErrors.APIError(`queryProfile ${err}`);
    }
};

/**
 * Query profile statements
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT).
 * @param {Timeframe} timeFrame
 * @return {string}
 */
 const queryStatement = async function (ticker, timeFrame) {
    try {       
        const { estimates, cashFlow, incomeStat, balanceSheet} = require('../../fetch/ticker/index');
        return {
            'Cash Flow': await cashFlow.getCashFlow(ticker, timeFrame),
            'Income Statement': await incomeStat.getIncomeStat(ticker, timeFrame),
            'Balance Sheet': await balanceSheet.getBalanceSheet(ticker, timeFrame),
        };
    } catch (err) {
        throw new customErrors.APIError(`queryStatement ${err}`);
    }
};

module.exports = {
    queryRatio: queryRatio,
    queryCurrentRatio: queryCurrentRatio,
    queryProfile: queryProfile,
    queryStatement: queryStatement,
};
