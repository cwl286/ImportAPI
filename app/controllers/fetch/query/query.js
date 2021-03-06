const { DOMParser } = require('xmldom');
const xpath = require('xpath-html');
const { BadRequestError } = require('../../error/index');

/**
 * Query DOM
 * @param {string} html - The URL of the page to examine, including protocol (e.g. http://). 
 * @param {string} tag - DOMParser tag depending on what type of structure contains the desired data. 
 * @param {number} index - The index, starting at 0, 
 *  which identifies which e.g. table or list in DOMParser should be returned. 
 *  default = null meaning return all
 * @return {string} 
 */
const queryDOM = function (html, tag, index = null) {
    try {
        let str = '';
        const parsed = new DOMParser({
            locator: {},
            errorHandler: {warning: function (w) { }}
        }).parseFromString(html, 'text/html');
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
        console.error(`Dom Parser Error: ${err.toString()}`);
        throw new BadRequestError(description = err.toString());
    }    
};


/**
 * Query Xpath
 * @param {*} xml - The URL of the page to examine, including protocol (e.g. http://). 
 * @param {*} query - The XPath query to run on the structured data. 
 * @return {string}
 */
const queryXpath = function (xml, query) {
    try {
        const nodes = xpath.fromPageSource(xml).findElements(query);
        return nodes.toString();
    } catch (err) {
        console.error(`Xpath Parser Error: ${err.toString()}`);
        throw new BadRequestError(description = err.toString());
    }
};

module.exports = {
    queryDOM: queryDOM,
    queryXpath: queryXpath,
};
