const app = require('../../app/index');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert, expect } = chai;

describe('app normal access', () => {
    let stubFunc;
    let requester;

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

    it('GET "/" to main', async function () {
        const res = await requester.get('/');
        expect(res.status).to.be.equal(200);
        expect(res.body.isSuccess).to.be.equal(true);
    });

    it('GET "/" to logout', async function () {
        const res = await requester.get('/logout');
        expect(res.status).to.be.equal(200);
        expect(res.body.isSuccess).to.be.equal(true);
    });
});
