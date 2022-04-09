const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');
const exp = require('constants');

describe('fetch/ratio/marketwatch stimulate getEstimation()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_est.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query marketwatch all estimates', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';       

        const res = await estimates.getEstimates(ticker);

        // first row
        expect(res['Yearly Numbers Estimates']['2021']['High']).to.be.equal(5.91);
        // last row
        expect(res['Yearly Numbers Estimates']['2024']['Average']).to.be.equal(6.83);
        // first row
        expect(res['Quarterly Numbers Actuals']['Q2 2021']['Estimate']).to.be.equal(0.99);
        // middle row
        expect(res['Quarterly Numbers Actuals']['Q2 2021']['Actual']).to.be.equal(1.4);
        // first row
        expect(res['Quarterly Numbers Estimates']['Q3 2022']['High']).to.be.equal(1.40);
        // last row
        expect(res['Quarterly Numbers Estimates']['Q3 2022']['Average']).to.be.equal(1.24);
    });

    it('query marketwatch CURRENT estimates', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await estimates.getCurrentEstimates(ticker);

        // expect this year
        const keys1 = Object.keys(res['Yearly Numbers Estimates']['2022']);
        expect(keys1.length).to.be.equal(3);
        const keys2 = Object.keys(res['Quarterly Numbers Actuals']['Q1 2022']);
        expect(keys1.length).to.be.equal(3);
        const keys3 = Object.keys(res['Quarterly Numbers Estimates']['Q2 2022']);
        expect(keys1.length).to.be.equal(3);

        // first row
        expect(res['Yearly Numbers Estimates']['2022']['High']).to.be.equal(6.61);
        // last row
        expect(res['Yearly Numbers Estimates']['2022']['Average']).to.be.equal(6.15);
        // first row
        expect(res['Quarterly Numbers Actuals']['Q1 2022']['Estimate']).to.be.equal(1.90);
        // last row
        expect(res['Quarterly Numbers Actuals']['Q1 2022']['Surprise']).to.be.equal(0.20);
        // first row
        expect(res['Quarterly Numbers Estimates']['Q2 2022']['High']).to.be.equal(1.56);
        // last row
        expect(res['Quarterly Numbers Estimates']['Q2 2022']['Average']).to.be.equal(1.43);
    });
});

describe('fetch/ratio/marketwatch real test getEstimation()', function () {
    it('query msft estimates and recieved 3 tables', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await estimates.getCurrentEstimates(ticker);

        const t1 = res['Yearly Numbers Estimates'];
        const t1Keys = Object.keys(t1);
        // numbers of estimates can be different, but it should have at least one
        expect(t1Keys.length).to.be.greaterThanOrEqual(1); 

        const t2 = res['Quarterly Numbers Actuals'];
        const t2Keys = Object.keys(t2);
        // numbers of estimates can be different, but it should have at least one
        expect(t2Keys.length).to.be.greaterThanOrEqual(1); 

        const t3 = res['Quarterly Numbers Estimates'];
        const t3Keys = Object.keys(t3);
        // numbers of estimates can be different, but it should have at least one
        expect(t3Keys.length).to.be.greaterThanOrEqual(1); 
    });

    it('query xom estimates and recieved 3 tables', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'xom';

        const res = await estimates.getCurrentEstimates(ticker);

        const t1 = res['Yearly Numbers Estimates'];
        const t1Keys = Object.keys(t1);
        // numbers of estimates can be different, but it should have at least one
        expect(t1Keys.length).to.be.greaterThanOrEqual(1); 

        const t2 = res['Quarterly Numbers Actuals'];
        const t2Keys = Object.keys(t2);
        // numbers of estimates can be different, but it should have at least one
        expect(t2Keys.length).to.be.greaterThanOrEqual(1); 

        const t3 = res['Quarterly Numbers Estimates'];
        const t3Keys = Object.keys(t3);
        // numbers of estimates can be different, but it should have at least one
        expect(t3Keys.length).to.be.greaterThanOrEqual(1); 
    });

    it('query tsla estimates and recieved 3 tables', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'tsla';

        const res = await estimates.getCurrentEstimates(ticker);

        const t1 = res['Yearly Numbers Estimates'];
        const t1Keys = Object.keys(t1);
        // numbers of estimates can be different, but it should have at least one
        expect(t1Keys.length).to.be.greaterThanOrEqual(1); 

        const t2 = res['Quarterly Numbers Actuals'];
        const t2Keys = Object.keys(t2);
        // numbers of estimates can be different, but it should have at least one
        expect(t2Keys.length).to.be.greaterThanOrEqual(1); 

        const t3 = res['Quarterly Numbers Estimates'];
        const t3Keys = Object.keys(t3);
        // numbers of estimates can be different, but it should have at least one
        expect(t3Keys.length).to.be.greaterThanOrEqual(1); 
    });

    it('query jnj estimates and recieved 3 tables', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'jnj';

        const res = await estimates.getCurrentEstimates(ticker);

        const t1 = res['Yearly Numbers Estimates'];
        const t1Keys = Object.keys(t1);
        // numbers of estimates can be different, but it should have at least one
        expect(t1Keys.length).to.be.greaterThanOrEqual(1); 

        const t2 = res['Quarterly Numbers Actuals'];
        const t2Keys = Object.keys(t2);
        // numbers of estimates can be different, but it should have at least one
        expect(t2Keys.length).to.be.greaterThanOrEqual(1); 

        const t3 = res['Quarterly Numbers Estimates'];
        const t3Keys = Object.keys(t3);
        // numbers of estimates can be different, but it should have at least one
        expect(t3Keys.length).to.be.greaterThanOrEqual(1); 
    });
});

describe('fetch/ratio/marketwatch real test getCurrentEstimation()', function () {
    it('query msft current estimates and recieved 3 tables', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await estimates.getCurrentEstimates(ticker);

        const t1 = res['Yearly Numbers Estimates'];
        const t1Keys = Object.keys(t1);
        // numbers of estimates can be different, but it should have at least one
        expect(t1Keys.length).to.be.equal(1); 
        // expect sub dict has High Low Average
        const subt1 = t1[t1Keys[0]];
        expect(Object.keys(subt1).length).to.be.equal(3); 

        const t2 = res['Quarterly Numbers Actuals'];
        const t2Keys = Object.keys(t2);
        // numbers of estimates can be different, but it should have at least one
        expect(t2Keys.length).to.be.equal(1); 
        // expect sub dict has Estimate Actual Surprise
        const subtt2 = t2[t2Keys[0]];
        expect(Object.keys(subtt2).length).to.be.equal(3); 

        const t3 = res['Quarterly Numbers Estimates'];
        const t3Keys = Object.keys(t3);
        // numbers of estimates can be different, but it should have at least one
        expect(t3Keys.length).to.be.equal(1); 
        // expect sub dict has High Low Average
        const subt3 = t3[t3Keys[0]];
        expect(Object.keys(subt3).length).to.be.equal(3); 
    });

    it('query xom estimates and recieved 3 tables', async function () {
        const { estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await estimates.getCurrentEstimates(ticker);

        const t1 = res['Yearly Numbers Estimates'];
        const t1Keys = Object.keys(t1);
        // numbers of estimates can be different, but it should have at least one
        expect(t1Keys.length).to.be.equal(1); 
        // expect sub dict has High Low Average
        const subt1 = t1[t1Keys[0]];
        expect(Object.keys(subt1).length).to.be.equal(3); 

        const t2 = res['Quarterly Numbers Actuals'];
        const t2Keys = Object.keys(t2);
        // numbers of estimates can be different, but it should have at least one
        expect(t2Keys.length).to.be.equal(1); 
        // expect sub dict has Estimate Actual Surprise
        const subtt2 = t2[t2Keys[0]];
        expect(Object.keys(subtt2).length).to.be.equal(3); 

        const t3 = res['Quarterly Numbers Estimates'];
        const t3Keys = Object.keys(t3);
        // numbers of estimates can be different, but it should have at least one
        expect(t3Keys.length).to.be.equal(1); 
        // expect sub dict has High Low Average
        const subt3 = t3[t3Keys[0]];
        expect(Object.keys(subt3).length).to.be.equal(3); 
    });
});

describe('fetch/ratio/marketwatch stimulate getCashflow() 1', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_cf_y1.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('Annual cash flow', async function () {
        const { cashFlow } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await cashFlow.getCashFlow(ticker, Timeframe.ANNUAL);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Operating Activities', 'Investing Activities', 'Financing Activities'];
        expect(keys).to.be.deep.equal(sections);
        
        // test each section
        const OA = res[sections[0]];
        // last column 94.68B
        expect(OA['2021']['Net Income before Extraordinaries']).to.be.equal(94680);
        // last column  (4.91B)
        expect(OA['2021']['Changes in Working Capital']).to.be.equal(-4910);
        // last column  28.44%
        expect(OA['2021']['Net Operating Cash Flow / Sales']).to.be.equal(0.2844);
        // first column 27.82%
        expect(OA['2017']['Net Operating Cash Flow / Sales']).to.be.equal(0.2782);

        const IA = res[sections[1]];
        // second table last column  -3.98%
        expect(IA['2021']['Net Investing Cash Flow / Sales']).to.be.equal(-0.0398);
        // second table first column 27.82%
        expect(IA['2017']['Net Investing Cash Flow / Sales']).to.be.equal(-0.2032);

        const FA = res[sections[2]];     
        // third table last row  -(14.47B)
        expect(FA['2021']['Cash Dividends Paid - Total']).to.be.equal(-14470);
        // third table first row '-'
        expect(FA['2017']['Free Cash Flow Yield']).to.be.equal('');   
    });
});

describe('fetch/ratio/marketwatch stimulate getCashflow() 1', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_cf_q1.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });


    it('Quarter cash flow', async function () {
        const { cashFlow } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await cashFlow.getCashFlow(ticker, Timeframe.QUARTER);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Operating Activities', 'Investing Activities', 'Financing Activities'];
        expect(keys).to.be.deep.equal(sections);
        
        // test each section
        const OA = res[sections[0]];
        // last column 34.63B
        expect(OA['31-Dec-2021']['Net Income before Extraordinaries']).to.be.equal(34630);
        // last column  6.53B
        expect(OA['31-Dec-2021']['Changes in Working Capital']).to.be.equal(6530);
        // last column  37.89%
        expect(OA['31-Dec-2021']['Net Operating Cash Flow / Sales']).to.be.equal(0.3789);
        // first column 34.75%
        expect(OA['31-Dec-2020']['Net Operating Cash Flow / Sales']).to.be.equal(0.3475);

        const IA = res[sections[1]];
        // second table last column  -12.99%
        expect(IA['31-Dec-2021']['Net Investing Cash Flow / Sales']).to.be.equal(-0.1299);
        // second table first column -7.70%
        expect(IA['31-Dec-2020']['Net Investing Cash Flow / Sales']).to.be.equal(-0.077);

        const FA = res[sections[2]];     
        // third table last row  (3.73B)
        expect(FA['31-Dec-2021']['Cash Dividends Paid - Total']).to.be.equal(-3730);
        // third table first row '-'
        expect(FA['31-Dec-2020']['Free Cash Flow Yield']).to.be.equal('');   
    });


    it('TTM cash flow', async function () {
        const { cashFlow } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await cashFlow.getCashFlow(ticker, Timeframe.TTM);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Operating Activities', 'Investing Activities', 'Financing Activities'];
        expect(keys).to.be.deep.equal(sections);

        // test each section: sum of four quarters
        const OA = res[sections[0]];
        expect(OA['31-Dec-2021']['Net Income before Extraordinaries']).to.be.equal(100550);
        expect(OA['31-Dec-2021']['Investment Tax Credit']).to.be.equal(0);
        expect(OA['31-Dec-2021']['Net Operating Cash Flow / Sales']).to.be.equal(undefined);

        const IA = res[sections[1]];
        expect(IA['31-Dec-2021']['Capital Expenditures']).to.be.equal(-10380);
        expect(IA['31-Dec-2021']['Net Assets from Acquisitions']).to.be.equal(-24);
        expect(IA['31-Dec-2021']['Net Investing Cash Flow Growth']).to.be.equal(undefined);

        const FA = res[sections[2]];  
        expect(FA['31-Dec-2021']['Cash Dividends Paid - Total']).to.be.equal(-14590);
        expect(FA['31-Dec-2021']['Issuance/Reduction of Debt, Net']).to.be.equal(undefined);
        expect(FA['31-Dec-2021']['Change in Long-Term Debt']).to.be.equal(undefined);   
    });
});

describe('fetch/ratio/marketwatch stimulate getCashflow() 2', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_cf_q2.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });


    it('Quarter cash flow', async function () {
        const { cashFlow } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await cashFlow.getCashFlow(ticker, Timeframe.QUARTER);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Operating Activities', 'Investing Activities', 'Financing Activities'];
        expect(keys).to.be.deep.equal(sections);
        
        // test each section
        const OA = res[sections[0]];
        // last column (145.96M)
        expect(OA['31-Dec-2021']['Net Income before Extraordinaries']).to.be.equal(-145.96);
        // last column  (43.22M)
        expect(OA['31-Dec-2021']['Changes in Working Capital']).to.be.equal(-43.22);
        // last column  -35.14%
        expect(OA['31-Dec-2021']['Net Operating Cash Flow / Sales']).to.be.equal(-0.3514);
        // first column '-'
        expect(OA['31-Mar-2021']['Net Operating Cash Flow / Sales']).to.be.equal('');

        const IA = res[sections[1]];
        // second table last column -7.79%
        expect(IA['31-Dec-2021']['Net Investing Cash Flow / Sales']).to.be.equal(-0.0779);
        // second table first column '-'
        expect(IA['31-Mar-2021']['Net Investing Cash Flow / Sales']).to.be.equal('');

        const FA = res[sections[2]];     
        // third table last row '-''
        expect(FA['31-Dec-2021']['Cash Dividends Paid - Total']).to.be.equal('');
        // third table first row '-'
        expect(FA['31-Mar-2021']['Free Cash Flow Yield']).to.be.equal('');   
    });


    it('TTM cash flow', async function () {
        const { cashFlow } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await cashFlow.getCashFlow(ticker, Timeframe.TTM);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Operating Activities', 'Investing Activities', 'Financing Activities'];
        expect(keys).to.be.deep.equal(sections);


        // test each section: sum of four quarters
        const OA = res[sections[0]];
        expect(OA['5-year trend']).to.be.equal(undefined); 
        expect(OA['31-Dec-2021']['Net Income before Extraordinaries']).to.be.equal(-228.38);
        expect(OA['31-Dec-2021']['Investment Tax Credit']).to.be.equal(0);
        expect(OA['31-Dec-2021']['Net Operating Cash Flow / Sales']).to.be.equal(undefined);

        const IA = res[sections[1]];
        expect(IA['5-year trend']).to.be.equal(undefined); 
        expect(IA['31-Dec-2021']['Capital Expenditures']).to.be.equal(-77.92);
        expect(IA['31-Dec-2021']['Net Assets from Acquisitions']).to.be.equal(-37.28);
        expect(IA['31-Dec-2021']['Net Investing Cash Flow Growth']).to.be.equal(undefined);

        const FA = res[sections[2]];  
        expect(FA['5-year trend']).to.be.equal(undefined); 
        expect(FA['31-Dec-2021']['Cash Dividends Paid - Total']).to.be.equal(0);
        expect(FA['31-Dec-2021']['Issuance/Reduction of Debt, Net']).to.be.equal(undefined);
        expect(FA['31-Dec-2021']['Change in Long-Term Debt']).to.be.equal(undefined);   
    });
});

describe('fetch/ratio/marketwatch stimulate getIncomeStat() 1', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_is_y1.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('Annual income statement', async function () {
        const { incomeStat } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await incomeStat.getIncomeStat(ticker, Timeframe.QUARTER);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Income Statement'];
        expect(keys).to.be.deep.equal(sections);
        
        const sec1 = res[sections[0]];
        expect(sec1['2021']['Sales/Revenue']).to.be.equal(365820);
        expect(sec1['2021']['EBITDA Margin']).to.be.equal(0.3287);
        expect(sec1['2017']['Sales/Revenue']).to.be.equal(228570);
        expect(sec1['2017']['EBITDA Margin']).to.be.equal('');
        expect(sec1['5-year trend']).to.be.equal(undefined); 
    });
});

describe('fetch/ratio/marketwatch stimulate getIncomeStat() 2', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_is_q1.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('Quarter income statement', async function () {
        const { incomeStat } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await incomeStat.getIncomeStat(ticker, Timeframe.QUARTER);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Income Statement'];
        expect(keys).to.be.deep.equal(sections);
        
        const sec1 = res[sections[0]];
        expect(sec1['31-Dec-2021']['Sales/Revenue']).to.be.equal(123950);
        expect(sec1['31-Dec-2021']['EBITDA Margin']).to.be.equal(0.3565);
        expect(sec1['31-Dec-2020']['Non Operating Income/Expense']).to.be.equal(-495);
    });

    it('TTM income statement', async function () {
        const { incomeStat } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await incomeStat.getIncomeStat(ticker, Timeframe.TTM);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Income Statement'];
        expect(keys).to.be.deep.equal(sections);
        
        const sec1 = res[sections[0]];
        expect(sec1['31-Mar-2021']).to.be.equal(undefined);
        expect(sec1['31-Dec-2021']['Sales/Revenue']).to.be.equal(378700);
        expect(sec1['31-Dec-2021']['EBITDA Margin']).to.be.equal(undefined);
        expect(sec1['31-Dec-2021']['SGA Growth']).to.be.equal(undefined);
        expect(sec1['31-Dec-2021']['Other Operating Expense']).to.be.equal(0);
    });
});


describe('fetch/ratio/marketwatch stimulate getBalanceSheet() 1', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_bs_q1.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('Quarter balance sheet', async function () {
        const { balanceSheet } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await balanceSheet.getBalanceSheet(ticker, Timeframe.QUARTER);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Assets', "Liabilities & Shareholders' Equity"];
        expect(keys).to.be.deep.equal(sections);
        
        const sec1 = res[sections[0]];
        expect(sec1['31-Dec-2021']['Cash & Short Term Investments']).to.be.equal(63910);
        expect(sec1['31-Dec-2021']['Total Assets Growth']).to.be.equal(0.086);
        expect(sec1['31-Dec-2020']['Property, Plant & Equipment - Gross']).to.be.equal(105490);


        const sec2 = res[sections[1]];
        expect(sec2['31-Dec-2021']['ST Debt & Current Portion LT Debt']).to.be.equal(16170);
        expect(sec2['31-Dec-2021']['Accounts Payable Growth']).to.be.equal(0.3579);
        expect(sec2['31-Dec-2020']['Common Equity (Total)']).to.be.equal(66220);
    });
});

describe('fetch/ratio/marketwatch stimulate getBalanceSheet() 2', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_bs_y1.html'), 'utf8');

        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('Year balance sheet', async function () {
        const { balanceSheet } = require('../../app/controllers/fetch/ticker/index');
        const Timeframe = require('../../app/controllers/fetch/ticker/Timeframe');
        const ticker = 'aapl';       

        const res = await balanceSheet.getBalanceSheet(ticker, Timeframe.QUARTER);

        // test keys
        const keys = Object.keys(res);
        const sections = ['Assets', "Liabilities & Shareholders' Equity"];
        expect(keys).to.be.deep.equal(sections);
        
        const sec1 = res[sections[0]];
        expect(sec1['2021']['Cash & Short Term Investments']).to.be.equal(62640);
        expect(sec1['2021']['Total Assets Growth']).to.be.equal(0.0837);
        expect(sec1['2020']['Property, Plant & Equipment - Gross']).to.be.equal(112100);


        const sec2 = res[sections[1]];
        expect(sec2['2021']['ST Debt & Current Portion LT Debt']).to.be.equal(17140);
        expect(sec2['2021']['Accounts Payable Growth']).to.be.equal(0.2948);
        expect(sec2['2020']['Common Equity (Total)']).to.be.equal(65340);
    });
});
