const app = require('../../app/index');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert, expect } = chai;

describe('app session with POST stimulation ', () => {
    let stubFunc;
    let requester;
    const apiUrl = '/api/v1/importhtml';
    const queryUrl = 'https://dummy.com';
    const queryCorrectTag = 'table';
    const apikey = 'AbHTJFYu0QDsr9u6Ax0i';

    before(function () {
        requester = chai.request.agent(app).keepOpen();

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

    it('POST with apikey and correct query, and query again without apikey', async function () {
        // Retaining cookies with each request
        let res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                tag: queryCorrectTag,
                apikey: apikey,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);

        res = await requester.post(apiUrl)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                url: queryUrl,
                tag: queryCorrectTag,
            });
        expect(res.status).to.be.equal(200);
        expect(res.body.result.length).to.be.greaterThan(0);
    });
});
