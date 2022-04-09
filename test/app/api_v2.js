const app = require('../../app/index');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert, expect } = chai;

describe.skip('/api/v2/queryprofile() real test', () => {
    const apiUrl = '/api/v2/queryprofile';

    const apikey = 'AbHTJFYu0QDsr9u6Ax0i';
    const ticker = 'aapl';
    let requester;

    before(function () {
        requester = chai.request(app).keepOpen();
    });

    after(async function () {
        requester.close();
    });

    it('GET "api/v2/queryprofile" method', async function () {
        const url = `${apiUrl}?apikey=${apikey}&ticker=${ticker}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.isSuccess).to.be.equal(true);
    });
});

describe.skip('/api/v2/queryticker() real test', () => {
    const apiUrl = '/api/v2/queryticker';

    const apikey = 'AbHTJFYu0QDsr9u6Ax0i';
    const ticker = 'aapl';
    let requester;

    before(function () {
        requester = chai.request(app).keepOpen();
    });

    after(async function () {
        requester.close();
    });

    it('GET "api/v2/queryticker" method', async function () {
        const url = `${apiUrl}?apikey=${apikey}&ticker=${ticker}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.isSuccess).to.be.equal(true);
        // should call the crawling methods with some results
        expect(Object.keys(res.body.result.finviz).length).to.be.greaterThan(0);
        expect(Object.keys(res.body.result.stockanalysis).length).to.be.greaterThan(0);
        expect(Object.keys(res.body.result.shortvolume).length).to.be.greaterThan(0);
        expect(Object.keys(res.body.result.marketwatch).length).to.be.greaterThan(0);
    });
});


describe.skip('/api/v2/queryprofile/current() real test', () => {
    const apiUrl = '/api/v2/querystatement/current/';

    const apikey = 'AbHTJFYu0QDsr9u6Ax0i';
    const ticker = 'aapl';
    let requester;

    before(function () {
        requester = chai.request(app).keepOpen();
    });

    after(async function () {
        requester.close();
    });

    it('GET "api/v2/querystatement" method', async function () {
        const url = `${apiUrl}?apikey=${apikey}&ticker=${ticker}`;
        const res = await requester.get(url);
        expect(res.status).to.be.equal(200);
        expect(res.body.isSuccess).to.be.equal(true);
    });
});

