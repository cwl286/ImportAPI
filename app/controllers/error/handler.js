const { BaseError } = require('./CustomErrors');
const { logger } = require('../logger/index');

/**
 * handle errors
 */
class ErrorHandler {
    /**
     * Final method to handle error
     * @param {Error} err from BaseError class
     */
    async handleError (err) {
        logger.error(
            'Error message from ErrorHandler: ',
            err
        );
    }

    /**
     * Check if it is customError type and operational
     * @param {Error} err 
     * @return {boolean}
     */
    isTrustedError(err) {
        return (err instanceof BaseError)? err.isOperational : false;
    }
}

module.exports.errorHandler = new ErrorHandler();
