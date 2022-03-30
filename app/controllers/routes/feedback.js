/**
 * Class to build json response
 */
class Message {
    /**
     * @constructs Message for building json response
     * @param {boolean} isSuccess successful or not.
     * @param {String} result The message.
     */
    constructor(isSuccess = false, result = '') {
        this.isSuccess = isSuccess;
        this.result = result;
    }
}

const error = new Message(isSuccess = false, result = 'Something broke!');

const failQuery = new Message(isSuccess = false, result = 'Fail to query!');

const unauth = new Message(isSuccess = false, result = 'Fail to authenticate apikey!');

const mainPage = new Message(isSuccess = true, result = 'This is the main page');

const logout = new Message(isSuccess = true, result = 'Logout successfully');

module.exports = {
    Message: Message,
    error: error,
    failQuery: failQuery,
    unauth: unauth,
    mainPage: mainPage,
    logout: logout,
};
