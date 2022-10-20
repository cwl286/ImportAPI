/**
 * Imports data from a html tag within an HTML page.
 * importHtml('http://en.wikipedia.org/wiki/Demographics_of_India','table',4)
 * @param {string} url - The URL of the page to examine, including protocol (e.g. http://). 
 * @param {string} tag - DOMParser tag depending on what type of structure contains the desired data. 
 * @param {number} index - The index, starting at 0, 
 *  which identifies which e.g. table or list in DOMParser should be returned. 
 *  default = null meaning return all
 * @return {string} 
 */
const importHtml = async function (url, tag, index = null) {
    const { getHtml } = require('../../../models/index');
    const { queryDOM } = require('../../fetch/index');

    const html = await getHtml(url);
    return (html) ? queryDOM(html, tag, index) : '';
};


/**
 * Imports data from any of various structured data types including XML, HTML, CSV, TSV, and RSS and ATOM XML feeds.
 * importXml('https://en.wikipedia.org/wiki/Moon_landing', '//a/@href')
 * @param {string} url - The URL of the page to examine, including protocol (e.g. http://). 
 * @param {string} query - The XPath query to run on the structured data. 
 * @return {string}
 */
const importXML = async function (url, query) {
    const { getHtml } = require('../../../models/index');
    const { queryXpath } = require('../../fetch/index');

    const html = await getHtml(url);
    return (html) ? queryXpath(html, query) : '';
};

/**
 * Ad hoc API for https://www.1823.gov.hk/common/ical/en.json
 * importJson('https://www.1823.gov.hk/common/ical/en.json')
 * @return {JSON}
 */
 const importJson = async function (url = "https://www.1823.gov.hk/common/ical/en.json") {
    
    const { getHtml } = require('../../../models/index');
    const obj = await getHtml(url);
    const data = obj["vcalendar"][0]["vevent"];
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
    return json;
};

module.exports = {
    importHtml: importHtml,
    importXML: importXML,
    importJson: importJson,
};
