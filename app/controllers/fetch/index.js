module.exports = {
  queryDOM: require('./query/index').queryDOM,
  queryXpath: require('./query/index').queryXpath,
  getFinviz: require('./ticker/index').getFinviz,
  getShortVolumeLatest: require('./ticker/index').getShortVolumeLatest,
  getStockAnalysisLatest: require('./ticker/index').getStockAnalysisLatest,
  getProfile: require('./ticker/index').getProfile,
};
