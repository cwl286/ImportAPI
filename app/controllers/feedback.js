/**
 * Class to build json response
 */
class Feedback {
    /**
     * @constructs feedback for building json response
     * @param {boolean} isSuccess successful or not.
     * @param {*} result 
     */
    constructor(isSuccess = false, result = '') {
        this.isSuccess = isSuccess;
        this.result = result;
    }
}

module.exports = Feedback;
