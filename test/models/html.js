const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');
const { BadRequestError } = require('passport-localapikey-update/lib/passport-localapikey');

describe('models/html getHtmlByAxios() real test', function () {
  const { getHtmlByAxios } = require('../../app/models/html');
  it('should return html tag including head and body tag', async function () {
    const url = 'https://yahoo.com';

    const html = await getHtmlByAxios(url);
    expect(html).to.be.a('string');
    expect(html).to.have.string('<html');
    expect(html).to.have.string('</html>');
    expect(html).to.have.string('<head');
    expect(html).to.have.string('</head>');
    expect(html).to.have.string('<body');
    expect(html).to.have.string('</body>');
  });

  it('should throw err if url is wrong.', async function () {
    const url = 'https://expectToBeWrongURL62839221.com';
    const foo = async () => {await getHtmlByAxios(url);};
    foo().catch(err => {assert(err instanceof BadRequestError, ' incorrect error');});
  });
});


describe('models/html getHtmlByPT() real test', function () {
  const { getHtmlByPT } = require('../../app/models/html');

  it('should use pupperteer and return html tag including head and body tag', async function () {
    const url = 'https://yahoo.com';

    const html = await getHtmlByPT(url);
    expect(html).to.be.a('string');
    expect(html).to.have.string('<html');
    expect(html).to.have.string('</html>');
    expect(html).to.have.string('<head');
    expect(html).to.have.string('</head>');
    expect(html).to.have.string('<body');
    expect(html).to.have.string('</body>');
  });

  it('should use pupperteer and throw err if url is wrong.', async function () {
    const url = 'https://expectToBeWrongURL62839221.com';
    
    const foo = async () => {await getHtmlByPT(url);};
    foo().catch(err => {assert(err instanceof BadRequestError, ' incorrect error');});
  });
});
