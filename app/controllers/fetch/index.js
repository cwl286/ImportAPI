module.exports = {
  queryDOM: require('./query/index').queryDOM,
  queryXpath: require('./query/index').queryXpath,
  getFinviz: require('./ticker/index').getFinviz,
  getShortVolumeLatest: require('./ticker/index').getShortVolumeLatest,
  getStockAnalysisLatest: require('./ticker/index').getStockAnalysisLatest,
  getProfile: require('./ticker/index').getProfile,
  estimates: require('./ticker/index').estimates,
  cashFlow: require('./ticker/index').cashFlow,
  incomeStat: require('./ticker/index').incomeStat,
  balanceSheet: require('./ticker/index').balanceSheet,
};
