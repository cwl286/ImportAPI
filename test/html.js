const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');


describe('models/html getHtml() real test', function() {
  const {getHtml} = require('../../WebAPI/app/models/index');

  it('should return html tag including head and body tag', async function () {    
    const url = 'https://api64.ipify.org?format=json';

    const html = await getHtml(url);
    expect(html).to.be.a('string');
    expect(html).to.have.string('<html>');
    expect(html).to.have.string('</html>');
    expect(html).to.have.string('<head>');
    expect(html).to.have.string('</head>');
    expect(html).to.have.string('<body>');
    expect(html).to.have.string('</body>');
  });

  it('should throw err if url is wrong.', async function () {
    const url = 'https://expectToBeWrongURL62839221.com';
    const foo = async () => {await getHtml(url);};
    foo().catch(error => {expect(error).to.be.an('error');});
  });
});
