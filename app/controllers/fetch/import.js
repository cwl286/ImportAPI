const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

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
    try {
        let str = '';
        const {getHtml} = require('../../models/index');
        const html = await getHtml(url);

        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const elems = (parsed)? parsed.getElementsByTagName(tag) : [];
        if (index && elems.length > 0 && elems.length > index) {
            return elems[index].toString();
        } else if (index && elems.length < index) {
            return str;
        }
        for (let i = 0; i < elems.length; i++) {
            str = str + elems[i].toString();
        }
        return str;
    } catch (err) {
        console.log(err);
        throw new Error(`importHtml: ${err}`);
    }    
};


/**
 * Imports data from any of various structured data types including XML, HTML, CSV, TSV, and RSS and ATOM XML feeds.
 * importXml('https://en.wikipedia.org/wiki/Moon_landing', '//a/@href')
 * @param {*} url - The URL of the page to examine, including protocol (e.g. http://). 
 * @param {*} query - The XPath query to run on the structured data. 
 * @return {string}
 */
const importXml = async function (url, query) {
    try {
        const {getHtml} = require('../../models/index');
        const html = await getHtml(url);
        const doc = (html)? new DOMParser().parseFromString(html) : '';
        return (doc)? xpath.select(query, doc).toString() : '';
    } catch (err) {
        throw new Error(`Invalid Xpath ${err}`);
    }
};

module.exports = {
    importHtml: importHtml,
    importXml: importXml,
};
