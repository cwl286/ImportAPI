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

    it('query ALL ratio in ARRAY format', async function () {
        const { crawlData } = require('../../app/controllers/fetch/ticker/stockanalysis');
        const ticker = 'aapl';

        const res = await crawlData(ticker);
        assert.isArray(res, 'not an array');

        // compare header
        const header = ['Quarter Ended', 'Market Capitalization', 'Market Cap Growth', 'Enterprise Value',
            'PE Ratio', 'PS Ratio', 'PB Ratio', 'Debt / Equity Ratio', 'Current Ratio', 'Asset Turnover',
            'Earnings Yield', 'FCF Yield', 'Dividend Yield', 'Payout Ratio',
            'Buyback Yield / Dilution', 'Total Shareholder Return'
        ];
        expect(res[0]).deep.to.equal(header);

        // expect 1 header row +  38 body rows 
        expect(res.length).deep.to.equal(39);

        // first row
        const currentRow = ['Current', 2883148, '-', 2942033, 29.37, 7.62,
            40.08, 1.71, 1.04, 1.08, 0.0349, 0.0353, 0.005, 0.142, 0.0347, 0.0397];
        expect(res[1]).deep.to.equal(currentRow);

        // last row
        const lastRow = ['2012-12-29', 479363, '-', 439543, 11.48, 2.91, 3.76, 0, 1.54, '-',
            0.0273, 0.0437, 0.0052, 0.191, -0.006, -0.0008];
        expect(res[res.length - 1]).deep.to.equal(lastRow);
    });

    it('query ALL ratio in dict format', async function () {
        const { getStockAnalysis } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getStockAnalysis(ticker);
        const keys = Object.keys(res);
        expect(keys.length).to.be.equal(38);
        // child dict has 16 records
        const childKeys = Object.keys(res[keys[0]]);
        expect(childKeys.length).to.be.equal(15);

        // latest info
        expect(res['Current']['Market Capitalization']).to.be.equal(2883148);
        expect(res['Current']['Market Cap Growth']).to.be.equal('-');
        expect(res['Current']['Total Shareholder Return']).to.be.equal(0.0397);

        // middle info
        expect(res['2021-12-25']['Market Capitalization']).to.be.equal(2892120);
        expect(res['2021-12-25']['Market Cap Growth']).to.be.equal(0.289);
        expect(res['2021-12-25']['Total Shareholder Return']).to.be.equal(0.036);

        // oldest info
        expect(res['2012-12-29']['Market Capitalization']).to.be.equal(479363);
        expect(res['2012-12-29']['Market Cap Growth']).to.be.equal('-');
        expect(res['2012-12-29']['Total Shareholder Return']).to.be.equal(-0.0008);
    });

    it('query latest ratio in dict format', async function () {
        const { getStockAnalysisLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getStockAnalysisLatest(ticker);
        const keys = Object.keys(res);
        expect(keys.length).to.be.equal(1);
        // child dict has 16 records
        const childKeys = Object.keys(res[keys[0]]);
        expect(childKeys.length).to.be.equal(15);

        expect(res['Current']['Market Capitalization']).to.be.equal(2883148);
        expect(res['Current']['Total Shareholder Return']).to.be.equal(0.0397);
        expect(res['Current']['Market Cap Growth']).to.be.equal('-');
    });
});


describe('fetch/ratio/stockanalysis real test getStockAnalysisLatest()', function () {
    it('query StockAnalysis correct ticker', async function () {
        const { getStockAnalysisLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getStockAnalysisLatest(ticker);
        const keys = Object.keys(res);
        expect(keys.length).to.be.equal(1);
        // child dict has 16 records
        const childKeys = Object.keys(res[keys[0]]);
        expect(childKeys.length).to.be.greaterThanOrEqual(15);

        const header = ['Market Capitalization', 'Market Cap Growth', 'Enterprise Value', 'PE Ratio',
            'PS Ratio', 'PB Ratio', 'Debt / Equity Ratio', 'Current Ratio', 'Asset Turnover', 'Earnings Yield',
            'FCF Yield', 'Dividend Yield', 'Payout Ratio', 'Buyback Yield / Dilution', 'Total Shareholder Return'
        ];
        for (const h of header) {
            assert(childKeys.includes(h), `cannot find child key ${h}`);
        }
    });

    it('query StockAnalysis Incorrect ticker', async function () {
        const { getStockAnalysisLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'wrongticker';

        const res = await getStockAnalysisLatest(ticker);
        const keys = Object.keys(res);
        expect(keys.length).to.be.equal(0);
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

describe('fetch/ratio/stockanalysis real getProfile()', function () {
    it('query profile correct ticker', async function () {
        const { getProfile } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getProfile(ticker);

        assert.isObject(res, 'not an object');
        expect(res['nameFull']).deep.to.equal('Microsoft Corporation');
        expect(res['info']['sector']).deep.to.equal('Information Technology');
    });

    it('query profile Incorrect ticker', async function () {
        const { getProfile } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'wrongticker';

        const res = await getProfile(ticker);

        assert.isObject(res, 'not an object');
        expect(res['nameFull']).to.be.equal(undefined);
        expect(res['info']).to.be.equal(undefined);
    });
});
