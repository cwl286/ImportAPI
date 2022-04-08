const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('fetch/ratio/marketwatch stimulate getEstimation()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/marketwatch1.html'), 'utf8')
        .replaceAll("aria=label", "xxx");
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query marketwatch all estimates', async function () {
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';       

        const res = await Estimates.getEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await Estimates.getCurrentEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await Estimates.getCurrentEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'xom';

        const res = await Estimates.getCurrentEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'tsla';

        const res = await Estimates.getCurrentEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'jnj';

        const res = await Estimates.getCurrentEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await Estimates.getCurrentEstimates(ticker);

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
        const { Estimates } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await Estimates.getCurrentEstimates(ticker);

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
