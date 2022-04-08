module.exports = {
    getFinviz: require('./finviz'),
    getShortVolume: require('./shortvolume').getData,
    getShortVolumeLatest: require('./shortvolume').getLatestData,
    getStockAnalysis: require('./stockanalysis').getData,
    getStockAnalysisLatest: require('./stockanalysis').getLatestData,
    getProfile: require('./stockanalysis').getProfile,
    Estimates: require('./marketwatch').Estimates,
};
