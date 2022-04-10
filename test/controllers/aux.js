const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('controllers/aux isValidUrl()', function () {
    const { isValidUrl } = require('../../app/controllers/aux/index');

    it('valid url', async function () {
        const url = 'https://www.yahoo.com';
        assert.equal(isValidUrl(url), true, 'should be valid');
    });

    it('invalid url', async function () {
        const url = 'dummyurl.com';
        assert.equal(isValidUrl(url), false, 'should be invalid');
    });
});

describe('controllers/aux finToMathFormat()', function () {
    const { finToMathFormat } = require('../../app/controllers/aux/index');

    it('convert to math format (10)', async function () {
        const res = finToMathFormat('(10)');
        expect(res).to.be.equal('-10');
    });

    it('convert to math format (1,000)', async function () {
        const res = finToMathFormat('(1,000)');
        expect(res).to.be.equal('-1,000');
    });

    it('convert to math format (1,000.99)', async function () {
        const res = finToMathFormat('(1,000.99)');
        expect(res).to.be.equal('-1,000.99');
    });

    it('convert to math format (10B)', async function () {
        const res = finToMathFormat('(10B)');
        expect(res).to.be.equal('-10B');
    });

    it('no change "-"', async function () {
        const res = finToMathFormat('-');
        expect(res).to.be.equal(null);
    });

    it('no change "-3.10%"', async function () {
        const res = finToMathFormat('-3.10%');
        expect(res).to.be.equal('-3.10%');
    });
    it('no change ""', async function () {
        const res = finToMathFormat('');
        expect(res).to.be.equal('');
    });

    it('testing long string', async function () {
        const res = finToMathFormat('testing long string (text)');
        expect(res).to.be.equal('testing long string (text)');
    });
});

describe('controllers/aux toMilBase()', function () {
    const { toMilBase } = require('../../app/controllers/aux/index');

    it('convert to mil. base: 1B', async function () {
        const res = toMilBase('1B');
        assert.equal(res, '1000', 'should be same');
    });

    it('convert to mil. base: 1K', async function () {
        const res = toMilBase('1K');
        assert.equal(res, '0.001', 'should be same');
    });

    it('convert to mil. base: ""', async function () {
        const res = toMilBase('');
        assert.equal(res, '', 'should be same');
    });

    it('convert to mil. base: -1B', async function () {
        const res = toMilBase('-1B');
        assert.equal(res, '-1000', 'should be same');
    });

    it('convert to mil. base: -', async function () {
        const res = toMilBase('-');
        assert.equal(res, '-', 'should be same');
    });

    it('convert to mil. base: 5.03% 4.95%', async function () {
        const res = toMilBase('5.03% 4.95%');
        assert.equal(res, '5.03% 4.95%', 'should be same');
    });
});


describe('controllers/aux tryParseFloat()', function () {
    const { tryParseFloat } = require('../../app/controllers/aux/index');

    it('try to convert to float type: 1,000', async function () {
        const res = tryParseFloat('1,000');
        assert.equal(res, '1000', 'should be same');
    });

    it('try to convert to float type: 10%', async function () {
        const res = tryParseFloat('10%');
        assert.equal(res, 0.1, 'should be same');
    });

    it('try to convert to float type: -10%', async function () {
        const res = tryParseFloat('-10%');
        assert.equal(res, -0.1, 'should be same');
    });

    it('try to convert to float type: sentence', async function () {
        const res = tryParseFloat('sentence%');
        assert.equal(res, 'sentence%', 'should be same');
    });


    it('try to convert to float type: null', async function () {
        const res = tryParseFloat(null);
        assert.equal(res, null, 'should be same');
    });
});

describe('controllers/aux arrayToObject()', function () {
    const { arrayToObject } = require('../../app/controllers/aux/index');
    it('case 1', async function () {
        const arr = [
            ['1a', '1b', '1c', '1d'],
            ['2a', '2b', '2c', '2d'],
            ['3a', '3b', '3c', '3d']
        ];
        const obj = {
            '1b': { '2a': '2b', '3a': '3b' },
            '1c': { '2a': '2c', '3a': '3c' },
            '1d': { '2a': '2d', '3a': '3d' }
        };
        expect(arrayToObject(arr)).to.be.deep.equal(obj);
    });

    it('case 2', async function () {
        const arr = [
            ['1a', '1b', '1c'],
            ['2a', '2b', '2c'],
            ['3a', '3b', '3c'],
            ['4a', '4b', '4c'],
            ['5a', '5b', '5c'],
        ];
        const obj = {
            '1b': { '2a': '2b', '3a': '3b', '4a': '4b', '5a': '5b' },
            '1c': { '2a': '2c', '3a': '3c', '4a': '4c', '5a': '5c' },
        };
        expect(arrayToObject(arr)).to.be.deep.equal(obj);
    });

    it('case 3', async function () {
        const arr = [
            ['1a', '1b', '1c'],
        ];
        const obj = {};
        expect(arrayToObject(arr)).to.be.deep.equal(obj);
    });

    it('case 4', async function () {
        const arr = [
            ['1a'],
            ['2a'],
            ['3a'],
            ['4a'],
        ];
        const obj = {};
        expect(arrayToObject(arr)).to.be.deep.equal(obj);
    });
});
