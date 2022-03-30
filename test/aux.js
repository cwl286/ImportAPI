const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('controllers/aux isValidUrl()', function () {
    const {isValidUrl} = require('../app/controllers/aux/index');

    it('valid url', async function () {
        const url = 'https://www.yahoo.com';
        assert.equal(isValidUrl(url), true, 'should be valid');
    });

    it('invalid url', async function () {
        const url = 'dummyurl.com';
        assert.equal(isValidUrl(url), false, 'should be invalid');
    });
});
