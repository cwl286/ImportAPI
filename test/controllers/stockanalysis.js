const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('fetch/ratio/shortanalysis stimulate getStockAnalysis()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/stockanalysis1.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query ratio', async function () {
        const { getStockAnalysis } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getStockAnalysis(ticker);

        assert.isArray(res, 'not an array');
        const header = ['Quarter Ended', 'Market Capitalization',
            'Market Cap Growth', 'Enterprise Value', 'PE Ratio',
            'PS Ratio', 'PB Ratio', 'Debt / Equity Ratio',
            'Current Ratio', 'Asset Turnover', 'Earnings Yield',
            'FCF Yield', 'Dividend Yield', 'Payout Ratio',
            'Buyback Yield / Dilution', 'Total Shareholder Return'
        ];
        expect(res[0]).deep.to.equal(header);
        const latest = ['Current', 2883148, '-', 2942033, 29.37, 7.62,
            40.08, 1.71, 1.04, 1.08, 0.0349, 0.0353, 0.005, 0.142, 0.0347, 0.0397];
        expect(res[1]).deep.to.equal(latest);
    });

    it('query latest ratio', async function () {
        const { getStockAnalysisLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getStockAnalysisLatest(ticker);

        assert.isObject(res, 'not an object');
        const header = ['Quarter Ended', 'Market Capitalization',
            'Market Cap Growth', 'Enterprise Value', 'PE Ratio',
            'PS Ratio', 'PB Ratio', 'Debt / Equity Ratio',
            'Current Ratio', 'Asset Turnover', 'Earnings Yield',
            'FCF Yield', 'Dividend Yield', 'Payout Ratio',
            'Buyback Yield / Dilution', 'Total Shareholder Return'
        ];
        const latest = ['Current', 2883148, '-', 2942033, 29.37, 7.62,
            40.08, 1.71, 1.04, 1.08, 0.0349, 0.0353, 0.005, 0.142, 0.0347, 0.0397];
    
        expect(res[header[3]]).to.equal(latest[3]);
        expect(res[header[7]]).to.equal(latest[7]);
    });
});


describe('fetch/ratio/stockanalysis real test getStockAnalysisLatest()', function () {
    it('query StockAnalysis without error', async function () {
        const { getStockAnalysisLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getStockAnalysisLatest(ticker);
        assert.isObject(res, 'not an object');
    });
});


describe('fetch/ratio/stockanalysis stimulate getProfile()', function () {
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

    it('query profile', async function () {
        const { getProfile } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getProfile(ticker);

        assert.isObject(res, 'not an object');
        expect(res['nameFull']).deep.to.equal('Apple Inc.');
        expect(res['info']['sector']).deep.to.equal('Information Technology');
    });
});

describe('fetch/ratio/stockanalysis real test getProfile()', function () {
    it('query profile', async function () {
        const { getProfile } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getProfile(ticker);

        assert.isObject(res, 'not an object');
        expect(res['nameFull']).deep.to.equal('Microsoft Corporation');
        expect(res['info']['sector']).deep.to.equal('Information Technology');
    });
});
