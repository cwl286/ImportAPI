const app = require('../../app/index');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert, expect } = chai;

describe('/api/v1/importHTML HTML: GET POST stimulation', () => {
    let stubFunc;
    let requester;
    const apiUrl = '/api/v1/importhtml';
    const queryUrl = 'https://dummy.com';
    const queryCorrectTag = 'table';
    const queryIncorrectTag = 'incorrectTag';
    const apikey = 'AbHTJFYu0QDsr9u6Ax0i';
    const queryIndex = '0';

    before(function () {
        requester = chai.request(app).keepOpen();

        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/sample1.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(async function () {
        requester.close();
        stubFunc.restore();
    });

    it('GET with correct query without apikey', async function () {
        const url = `${apiUrl}?url=${queryUrl}&tag=${queryCorrectTag}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(401);
    });

    it('GET with apikey and correct query, but without index', async function () {
        const url = `${apiUrl}?url=${queryUrl}&tag=${queryCorrectTag}&apikey=${apikey}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });

    it('GET with apikey, correct query and index', async function () {
        const url = `${apiUrl}?url=${queryUrl}&tag=${queryCorrectTag}&apikey=${apikey}&index=${queryIndex}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });

    it('GET with apikey, incorrect query and index', async function () {
        const url = `${apiUrl}?url=${queryUrl}&tag=${queryIncorrectTag}&apikey=${apikey}&index=${queryIndex}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.equal(0);
    });

    it('POST with correct query without apikey', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                tag: queryCorrectTag,
            });
        expect(res.status).to.be.equal(401);
    });

    it('POST with apikey and correct query, but without index', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                tag: queryCorrectTag,
                apikey: apikey,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });

    it('POST with apikey correct query, and index', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                tag: queryCorrectTag,
                apikey: apikey,
                index: queryIndex,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });

    it('POST with apikey incorrect query, and index', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                tag: queryIncorrectTag,
                apikey: apikey,
                index: queryIndex,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.equal(0);
    });
});


describe('/api/v1/importXML XML: GET POST stimulation', () => {
    let stubFunc;
    let requester;
    const apiUrl = '/api/v1/importxml';
    const queryUrl = 'https://dummy.com';
    const correctQuery = '//table';
    const incorrectQuery = '//incorrectTag';
    const apikey = 'AbHTJFYu0QDsr9u6Ax0i';

    before(function () {
        requester = chai.request(app).keepOpen();

        // stub sample html to the getHtml()
        const path = require('path');
        const html = require('fs').readFileSync(path.join(__dirname, '../sample/sample1.html'), 'utf8');
        const models = require('../../app/models/index');
        stubFunc = sinon.stub(models, 'getHtml').callsFake(function fakeFn() {
            return html;
        });
    });

    after(async function () {
        requester.close();
        stubFunc.restore();
    });

    it('GET with correct query without apikey', async function () {
        const url = `${apiUrl}?url=${queryUrl}&query=${correctQuery}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(401);
    });

    it('GET with apikey and correct query', async function () {
        const url = `${apiUrl}?url=${queryUrl}&query=${correctQuery}&apikey=${apikey}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });

    it('GET with apikey and incorrect query', async function () {
        const url = `${apiUrl}?url=${queryUrl}&query=${incorrectQuery}&apikey=${apikey}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.equal(0);
    });

    it('POST with correct query without apikey', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                query: correctQuery,
            });
        expect(res.status).to.be.equal(401);
    });

    it('POST with correct query with apikey', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                query: correctQuery,
                apikey: apikey,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });

    it('POST with incorrect query with apikey', async function () {
        const res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                query: incorrectQuery,
                apikey: apikey,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.equal(0);
    });
});

