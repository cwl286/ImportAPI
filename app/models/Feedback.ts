/**
 * Class to build json response
 */
 class Feedback {
     protected isSuccess: boolean;
     protected result: string;
    /**
     * @constructs feedback for building json response
     * @param {boolean} isSuccess successful or not.
     * @param {*} result 
     */
    constructor(isSuccess: boolean = false, result: string = '') {
        this.isSuccess = isSuccess;
        this.result = result;
    }
}

export { Feedback };
