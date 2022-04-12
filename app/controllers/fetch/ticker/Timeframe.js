const Timeframe = {
    ANNUAL: 0,
    QUARTER: 1,
    TTM: 2,
    // Exculsive for Balance Sheet: to calculate average TTM for Calculation
    // 'Average Total Assets', 'Average Total Accounts Receivable', 'Average Inventories', 
    // 'Average Accounts Payable'
    TTM_BS: 3, 
    // Exculsive for Income Statment for Calculation
    TTM_IS: 4, 
};

module.exports = Timeframe;
