/**
 * check is valid url
 * @param {*} string 
 * @return {boolean}
 */
function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
}

module.exports = {
    isValidUrl: isValidUrl,
};
