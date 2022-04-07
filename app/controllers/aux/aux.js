/**
 * check is valid url
 * @param {*} string 
 * @return {boolean}
 */
const isValidUrl = function (string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
};
/**
 * convert financial number to math number 
 * e.g. '(1000)' -> '-1000'
 * '-'  ->  ''
 * '1,000' -> '1000'
 * @param {string} str 
 * @return {string}
 */
const finToMathFormat = function (str) {
    if (!str) {
        return '';
    }
    else if (str == '-') {
        // //  '-'  ->  '0'
        return str.replace('-', '');
    }
    // (1000) -> -1000
    return str.replaceAll(',', '').replace('(', '-').replace(')', '');
};

/**
 * convert to million base
 * e.g. 1B -> 1000
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
        return Math.round(parseFloat(str)*100)/100;
    } else if (str.indexOf('%') == str.length - 1) {
        // e.g. 15%
        let v = parseFloat(str) / 100;
        v = Math.round(v * 100)/100;
        return (!isNaN(v))? v : input;
    }
    return input;
};

/**
 * Transponse a array
 * @param {Array} arr 
 * @return {Array}
 */
const transpose = function (arr) {
    return arr[0].map((_, colIndex) => arr.map(row => row[colIndex])); 
};

module.exports = {
    toMilBase: toMilBase,
    finToMathFormat: finToMathFormat,
    isValidUrl: isValidUrl,
    tryParseFloat: tryParseFloat,
    transpose: transpose
};
