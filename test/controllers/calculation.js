const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');
const path = require('path');

describe('fetch/ticker/Calcuation stimulate Calculation()', function () {
    let BS = null, CF = null, IS = null;

    // stub sample html to the getHtml()
    before(async function () {
        const models = require('../../app/models/index');
        const timeFrame = 2;
        const ticker = 'aapl';

        let stubFunc = null;
        let html = '';

        // Prepare BS
        html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_bs_q1.html'), 'utf8');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {return html;});
        stubFunc.restore();
        const { balanceSheet } = require('../../app/controllers/fetch/ticker/index');
        // set TTM_BS = 3
        BS = await balanceSheet.getBalanceSheet(ticker, 3);

        // Prepare CF
        html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_cf_q1.html'), 'utf8');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {return html;});
        stubFunc.restore();
        const { cashFlow } = require('../../app/controllers/fetch/ticker/index');
        CF = await cashFlow.getCashFlow(ticker, 2);

        // Parepare IS
        html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch_is_q1.html'), 'utf8');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {return html;});
        stubFunc.restore();
        const { incomeStat } = require('../../app/controllers/fetch/ticker/index');
        // set TTM_IS = 4
        IS = await incomeStat.getIncomeStat(ticker, 4);
    });

    after(function () {
    });

    it('test calcualtion _isValid()', async function () {
        const Calcuation = require('../../app/controllers/fetch/ticker/Calculation');
        
        const cal = new Calcuation(BS, IS, CF);
        
        const valid = cal._isValid();        
        expect(valid).to.be.equal(true);
    });

    it('test calcualtion _prepareData()', async function () {
        const Calcuation = require('../../app/controllers/fetch/ticker/Calculation');
        
        const cal = new Calcuation(BS, IS, CF);

        const data = cal._prepareData();    
        console.log(data); 

        expect(data['Price']).to.be.not.equal(undefined);
        // items from each table
        expect(data['Net Income before Extraordinaries']).to.be.not.equal(undefined);
        expect(data['Capital Expenditures']).to.be.not.equal(undefined);
        expect(data['Cash Dividends Paid - Total']).to.be.not.equal(undefined);
        expect(data['Cash & Short Term Investments']).to.be.not.equal(undefined);
        expect(data['ST Debt & Current Portion LT Debt']).to.be.not.equal(undefined);
        expect(data[`Liabilities & Shareholders' Equity`]).to.be.not.equal(undefined);
        expect(data[`SG&A Expense`]).to.be.not.equal(undefined);
    });

    it('test calcualtion calculate()', async function () {
        const Calcuation = require('../../app/controllers/fetch/ticker/Calculation');
        
        const cal = new Calcuation(BS, IS, CF);
        const res = cal.calculate();
        console.log(res);
        expect(Object.keys(res).length).to.be.equal(21);
    });
});
