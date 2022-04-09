module.exports = {
    getFinviz: require('./finviz'),
    getShortVolume: require('./shortvolume').getData,
    getShortVolumeLatest: require('./shortvolume').getLatestData,
    getStockAnalysis: require('./stockanalysis').getData,
    getStockAnalysisLatest: require('./stockanalysis').getLatestData,
    getProfile: require('./stockanalysis').getProfile,
    estimates: require('./marketwatch').estimates,
    cashFlow: require('./marketwatch').cashFlow,
    incomeStat: require('./marketwatch').incomeStat,
    balanceSheet: require('./marketwatch').balanceSheet,
    Timeframe: require('./Timeframe')
};
