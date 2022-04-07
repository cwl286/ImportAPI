
/**
 * Query ratio data from several websites
 * @param {string} ticker - ticker of a share company(e.g. AAPL, MSFT). 
 * @return {string}
 */
const queryRatio = async function (ticker) {
    try {
        const { getFinviz, getStockAnalysisLatest, getShortVolumeLatest } = require('../../fetch/ticker/index');
        return {
            finviz: await getFinviz(ticker),
            stockanalysis: await getStockAnalysisLatest(ticker),
            shortvolume: await getShortVolumeLatest(ticker),
        };
    } catch (err) {
        throw new Error(`queryRatio ${err}`);
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
        throw new Error(`queryProfile ${err}`);
    }
};

module.exports = {
    queryRatio: queryRatio,
    queryProfile: queryProfile,
};
