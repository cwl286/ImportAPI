const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('controllers/aux isValidUrl()', function () {
    const {isValidUrl} = require('../../app/controllers/aux/index');

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
    const {finToMathFormat} = require('../../app/controllers/aux/index');

    it('convert to math format (10)', async function () {
        const res = finToMathFormat('(10)');
        assert.equal(res, '-10', 'should be same');
    });

    it('convert to math format (1,000)', async function () {
        const res = finToMathFormat('(1,000)');
        assert.equal(res, '-1000', 'should be same');
    });

    it('convert to math format (10B)', async function () {
        const res = finToMathFormat('(10B)');
        assert.equal(res, '-10B', 'should be same');
    });

    it('no change "-"', async function () {
        const res = finToMathFormat('-');
        assert.equal(res, '', 'should be zero');
    });

    it('no change "-3.10%"', async function () {
        const res = finToMathFormat('-3.10%');
        assert.equal(res, '-3.10%', 'should be no change');
    });
    it('no change ""', async function () {
        const res = finToMathFormat('');
        assert.equal(res, '', 'should be no change');
    });
});

describe('controllers/aux toMilBase()', function () {
    const {toMilBase} = require('../../app/controllers/aux/index');

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
    const {tryParseFloat} = require('../../app/controllers/aux/index');

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
