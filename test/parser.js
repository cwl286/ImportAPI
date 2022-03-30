const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');

describe('parser/import stimulate importHtml()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '/sample1.html'), 'utf8');
        const models = require('../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query body', async function () {
        const {importHtml} = require('../app/controllers/fetch/index');
        const res = await importHtml('https://www.fake.come', 'body');
        assert.isString(res, 'not a string');
        assert.isBoolean(res.startsWith('<body>'), 'not start with <body>');
        assert.isBoolean(res.endsWith('</body>'), 'not end with </body>');
    });

    it('query wrong tag', async function () {
        const {importHtml} = require('../app/controllers/fetch/index');
        const res = await importHtml('https://www.fake.come', 'li');
        assert.isString(res, 'not a string');
        assert.isBoolean(res.length == 0, 'should be empty string');
    });
});


describe('parser/import stimulate importXml()', function () {
    let stubFunc;

    before(function () {
        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '/sample1.html'), 'utf8');
        const models = require('../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(function () {
        stubFunc.restore();
    });

    it('query body', async function () {
        const {importXml} = require('../app/controllers/fetch/index');
        const res = await importXml('https://www.fake.come', '//body');
        assert.isString(res, 'not a string');
        assert.isBoolean(res.startsWith('<body>'), 'not start with <body>');
        assert.isBoolean(res.endsWith('</body>'), 'not end with </body>');
    });

    it('query wrong tag', async function () {
        const {importXml} = require('../app/controllers/fetch/index');
        const res = await importXml('https://www.fake.come', '//li');
        assert.isString(res, 'not a string');
        assert.isBoolean(res.length == 0, 'should be empty string');
    });
});
