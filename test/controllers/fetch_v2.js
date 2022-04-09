const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('fetch/routes/v2/queryProfile() stimulation', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/stockanalysis2.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query profile stimulation', async function () {
        const {queryProfile} = require('../../app/controllers/routes/v2/query');
        const ticker = 'aapl';
        const res = await queryProfile(ticker);
        assert.isObject(res, 'not an object');
        expect(res['nameFull']).deep.to.equal('Apple Inc.');
        expect(res['info']['sector']).deep.to.equal('Information Technology');
    });
});

describe('fetch/routes/v2/queryRatio() real test', function () {
    it('query queryRatio ', async function () {
        const { queryRatio } = require('../../app/controllers/routes/v2/query');
        const ticker = 'aapl';
        const res = await queryRatio(ticker);
        assert.isObject(res, 'not an object');
        assert(Object.keys(res).length > 0, 'empty result');
        // from finviz
        expect(res.finviz['Index']).to.be.equal('DJIA S&P500');
        // from stockanalysis
        expect(res.stockanalysis['Market Cap Growth']).to.be.equal('-');
    });
});

describe('fetch/routes/v2/queryStatement() real test', function () {
    it('query queryStatement', async function () {
        const { queryStatement } = require('../../app/controllers/routes/v2/query');
        const ticker = 'msft';
        const res = await queryStatement(ticker, 2);
        assert.isObject(res, 'not an object');
        assert(Object.keys(res).length > 0, 'empty result');
        expect(res['Balance Sheet']['Currency']).to.be.equal('USD');
        expect(res['Cash Flow']['Currency']).to.be.equal('USD');

        expect(res['Income Statement']['Income Statement'].length).to.be.greaterThan(0);
        expect(res['Balance Sheet']['Assets'].length).to.be.greaterThan(0);
        expect(res['Cash Flow']['Operating Activities'].length).to.be.greaterThan(0);
    });
});
