const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('fetch/ratio/shortvolume stimulate getShortVolume()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/shortvolume.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query shortvolume ratio in array format', async function () {
        const {crawlData } = require('../../app/controllers/fetch/ticker/shortvolume');
        const ticker = 'aapl';

        const res = await crawlData(ticker);

        assert.isArray(res, 'not an array');
        expect(res[0]).deep.to.equal(['Date', 'Short Volume', 'Long Volume', 'Short Volume Percent']);
        expect(res[res.length - 1]).deep.to.equal(['2022-04-01', 20878069, 21955279, 49]);
    });


    it('query shortvolume all ratio in dict format', async function () {
        const { getShortVolume } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getShortVolume(ticker);

        assert.isObject(res, 'not a object');
        
        // one dict with many dates as keys
        const keys = Object.keys(res);
        expect(keys.length).to.be.greaterThan(1);

        // any child dict contain a dict with 3 keys
        const childKeys = Object.keys(res[keys[1]]);
        expect(childKeys.length).to.be.equal(3);

        expect(res['2022-03-31']['Short Volume']).to.be.equal(27627795);
        expect(res['2022-03-30']['Short Volume']).to.be.equal(32225102);
        expect(res['2022-03-29']['Short Volume']).to.be.equal(31408913);
    });

    it('query shortvolume latest ratio in dict format', async function () {
        const { getShortVolumeLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getShortVolumeLatest(ticker);

        assert.isObject(res, 'not a object');
        expect(res['2022-04-01']['Long Volume']).to.equal(21955279);
    });
});


describe('fetch/ratio/shortvolume real test getShortVolumeLatest()', function () {
    it('query ShortVolume without error', async function () {
        const { getShortVolumeLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getShortVolumeLatest(ticker);
        // one dict with the latest date as the only one key
        const keys = Object.keys(res);
        expect(keys.length).to.be.equal(1);

        // this child dict contain a dict with 3 keys
        const childKeys = Object.keys(res[keys[0]]);
        expect(childKeys.length).to.be.equal(3);
    });
});
