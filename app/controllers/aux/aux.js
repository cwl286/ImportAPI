/**
 * check is valid url
 * @param {string} str 
 * @return {boolean}
 */
const isValidUrl = function (str) {
    try {
        new URL(str);
    } catch (_) {
        return false;
    }
    return true;
};

/**
 * convert to million base
 * e.g. 1B -> 1000, 
 * 1K -> 0.001
 * 1M -> 1
 * @param {string} str 
 * @return {string}
 */
const toMilBase = function (str) {
    if (!str) {
        return '';
    }
    if (str.slice(-1) == 'M') {
        return str.replaceAll(',', '').replace('M', '');
    } else if (str.slice(-1) == 'B') {
        // convert billion to million format e.g. 1B -> 1000
        return String(parseFloat(str.replaceAll(',', '').replace('B', '')) * 1000);
    } else if (str.slice(-1) == 'K') {
        // convert billion to million format e.g. 1K -> 0.001
        return String(parseFloat(str.replaceAll(',', '').replace('K', '')) / 1000);
    }
    return str;
};

/**
 * try to parse a string into float type
 * otherwise return itself
 * @param {string} input 
 * @return {number} 
 */
const tryParseFloat = function (input) {
    if (!input) {
        return input;
    }
    const str = input.toString().replaceAll(',', '');
    if (!isNaN(str)) {
        // e.g. 15,000
        return Math.round(parseFloat(str) * 10000) / 10000;
    } else if (str.indexOf('%') == str.length - 1) {
        // e.g. 15%
        let v = parseFloat(str) / 100;
        v = Math.round(v * 10000) / 10000;
        return (!isNaN(v)) ? v : input;
    }
    return input;
};

/**
 * convert financial number to math number 
 * e.g. '(1000)' -> '-1000', '-'  ->  0, '1,000' -> '1000'
 * @param {string} str 
 * @return {string}
 */
const finToMathFormat = function (str) {
    if (!str) {
        return '';
    } else if (str === '-') {
        return null;
    }
    const finds = str.match(/([0-9.,]+[TBMK]?)/g);
    if (finds) {
        for (const f of finds) {
            str = (!isNaN(f.replace(/[TBMK,]+/g, ''))) ? str.replaceAll(`(${f})`, `-${f}`) : str;
        }
    }
    return str;
};

/**
 * Transponse a array
 * @param {Array} arr 
 * @return {Array}
 */
const transpose = function (arr) {
    return arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
};

/**
 * Find all indexes of a string in a longer string
 * @param {string} str longer string 
 * @param {string} target target string
 * @return {Array} array of number
 */
const indexesOf = function (str, target) {
    const startingIndices = [];
    let indexOccurence = str.indexOf(target, 0);
    while (indexOccurence >= 0) {
        startingIndices.push(indexOccurence);
        indexOccurence = str.indexOf(target, indexOccurence + 1);
    }
    return startingIndices;
};

/**
 * Aux function to convert an array of arrays into an object of objects
 * e.g. from:
 * ['1a', '1b', '1c', '1d'],
 * ['2a', '2b', '2c', '2d'],
 * ['3a', '3b', '3c', '3d']
 * e.g. To: 
 * {1b: {2a: 2b, 3a: 3b}}
 * {1c: {2a: 2c, 3a: 3c}}
 * {1d: {2a: 2d, 3a: 3d}}
 * @param {Array} arr a 2d array repsentating rows of a table
 * @return {Object} object of objects
 */
const arrayToObject = (arr) => {
    if (!arr) {
        return {};
    } else if (arr.length === 0) {
        return {};
    } else if (arr[0] === 0) {
        return {};
    }
    const dict = {};
    const headers = arr[0].slice(1);
    arr.slice(1).map((row, _) => {
        row.slice(1).map((cell, colIndex) => {
            const $ = {};
            $[row[0]] = cell;
            dict[headers[colIndex]] = { ...dict[headers[colIndex]], ...$ };
        });
    });
    return dict;
}

module.exports = {
    toMilBase: toMilBase,
    finToMathFormat: finToMathFormat,
    isValidUrl: isValidUrl,
    tryParseFloat: tryParseFloat,
    transpose: transpose,
    indexesOf: indexesOf,
    arrayToObject: arrayToObject,
};
