const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('controllers/v2/queryRatio() stimulation', function () {
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

describe('controllers/v2/queryRatio() real test', function () {
    it('query queryRatio Correct ticker', async function () {
        const { queryRatio } = require('../../app/controllers/routes/v2/query');
        const ticker = 'aapl';
        const res = await queryRatio(ticker);
        assert.isObject(res, 'not an object');
        assert(Object.keys(res).length > 0, 'empty result');
        expect(res['finviz']['Index']).to.be.equal('DJIA S&P500');
        expect(res['stockanalysis']['Current']['Market Cap Growth']).to.be.equal('-');
    });

    it('query queryRatio Incorrect ticker', async function () {
        const { queryRatio } = require('../../app/controllers/routes/v2/query');
        const ticker = 'wrongticker';
        const res = await queryRatio(ticker);
        assert.isObject(res, 'not an object');
        expect(Object.keys(res['marketwatch']).length).to.be.equal(0);
        expect(Object.keys(res['finviz']).length).to.be.equal(0);
        expect(Object.keys(res['stockanalysis']).length).to.be.equal(0);
        expect(Object.keys(res['shortvolume']).length).to.be.equal(0);
    });

    it('query queryCurrentRatio Incorrect ticker ', async function () {
        const { queryCurrentRatio } = require('../../app/controllers/routes/v2/query');
        const ticker = 'wrongticker';
        const res = await queryCurrentRatio(ticker);
        console.log(res);
        assert.isObject(res, 'not an object');
        expect(Object.keys(res['marketwatch']).length).to.be.equal(0);
        expect(Object.keys(res['finviz']).length).to.be.equal(0);
        expect(Object.keys(res['stockanalysis']).length).to.be.equal(0);
        expect(Object.keys(res['shortvolume']).length).to.be.equal(0);
    });
});

describe('controllers/v2/queryStatement() real test', function () {
    it('query queryStatement correct ticker', async function () {
        const { queryStatement } = require('../../app/controllers/routes/v2/query');
        const ticker = 'msft';
        const res = await queryStatement(ticker, 2);
        assert.isObject(res, 'not an object');
        assert(Object.keys(res).length > 0, 'empty result');

        expect(Object.keys(res['Income Statement']).length).to.be.greaterThan(0);
        expect(Object.keys(res['Balance Sheet']).length).to.be.greaterThan(0);
        expect(Object.keys(res['Cash Flow']).length).to.be.greaterThan(0);
    });

    it('query queryStatement incorrect ticker', async function () {
        const { queryStatement } = require('../../app/controllers/routes/v2/query');
        const ticker = 'wrongticker';
        const res = await queryStatement(ticker, 2);
        assert.isObject(res, 'not an object');
        assert(Object.keys(res).length > 0, 'empty result');
        expect(res['Balance Sheet']['Currency']).to.be.equal('');
        expect(res['Cash Flow']['Currency']).to.be.equal('');

        expect(Object.keys(res['Income Statement']['Income Statement']).length).to.be.equal(0);
        expect(Object.keys(res['Balance Sheet']['Assets']).length).to.be.equal(0);
        expect(Object.keys(res['Cash Flow']['Operating Activities']).length).to.be.equal(0);
    });
});
