const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('fetch/ratio/finviz stimulate 1st getFinviz()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/finviz1.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query finviz ratio', async function () {
        const { getFinviz } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getFinviz(ticker);

        assert.isObject(res, 'not a object');
        assert.equal(res['Income'], 100560, 'incorrect income');
        assert.equal(res['EPS next Y'], 0.0647, 'incorrect epsnexty');
        assert.equal(res['Earnings'], 'Jan 27 AMC', 'incorrect date');
        assert.equal(res['Volatility'], '1.82% 2.59%', 'incorrect volatility');
    });
});

describe('fetch/ratio/finviz stimulate 2nd getFinviz()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/finviz2.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query finviz ratio', async function () {
        const { getFinviz } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getFinviz(ticker);

        assert.isObject(res, 'not a object');
        assert.equal(res['Index'], '', 'incorrect index');
        assert.equal(res['Optionable'], 'Yes', 'incorrect optionable');
        assert.equal(res['52W High'], -0.5986, 'incorrect 52whigh');
        assert.equal(res['Debt/Eq'], 0.03, 'incorrect Debt/Eq');
    });
});

describe('fetch/ratio/finviz real test getFinviz()', function () {
    it('query Finviz without error', async function () {
        const { getFinviz } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getFinviz(ticker);

        assert.isObject(res, 'not an object');
        expect(res['Index']).to.be.equal('DJIA S&P500');
    });
});

