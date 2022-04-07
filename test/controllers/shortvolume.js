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

    it('query shortvolume ratio', async function () {
        const { getShortVolume } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getShortVolume(ticker);

        assert.isArray(res, 'not an array');
        expect(res[0]).deep.to.equal(['Date', 'Short Volume', 'Long Volume', 'Short Volume Percent']);
        expect(res[res.length - 1]).deep.to.equal(['2022-04-01', 20878069, 21955279, 0.49]);
    });

    it('query shortvolume latest ratio', async function () {
        const { getShortVolumeLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'aapl';

        const res = await getShortVolumeLatest(ticker);

        assert.isObject(res, 'not a object');
        expect(res['Date']).to.equal('2022-04-01');
        expect(res['Long Volume']).to.equal(21955279);
    });
});

describe('fetch/ratio/shortvolume real test getShortVolumeLatest()', function () {
    it('query ShortVolume without error', async function () {
        const { getShortVolumeLatest } = require('../../app/controllers/fetch/ticker/index');
        const ticker = 'msft';

        const res = await getShortVolumeLatest(ticker);
        assert.isObject(res, 'not an object');
    });
});
