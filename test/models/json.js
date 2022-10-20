const { describe, it } = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');
const { BadRequestError } = require('passport-localapikey-update/lib/passport-localapikey');


describe('models/json getJson() real test', function () {
  const { getHtml } = require('../../app/models/html');

  it('Should work HK', async function () {
    const url = 'https://www.1823.gov.hk/common/ical/en.json';

    const html = await getHtml(url);

    expect(html).to.be.not.empty;

    const data = html["vcalendar"][0]["vevent"];
    const json = {};
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      let dict = {};
      dict["uid"] = row["uid"];
      const dtstart = row["dtstart"][0];
      dict["dtstart"] = dtstart.substring(6, 8) + '/' + dtstart.substring(4, 6) + '/' + dtstart.substring(0, 4);
      const dtend = row["dtend"][0];
      dict["dtend"] = dtend.substring(6, 8) + '/' + dtend.substring(4, 6) + '/' + dtend.substring(0, 4);
      dict["summary"] = row["summary"];
      json[i] = dict;
    }
    console.log(JSON.parse(JSON.stringify(json)));

    
  });
  // it('Should work IP', async function () {
  //   const url = 'http://ip.jsontest.com/';

  //   const json = await getJson(url);

  //   expect(json).to.be.not.empty;
  //   console.log(json);
  // });
});



