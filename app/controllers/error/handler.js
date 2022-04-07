const { BaseError } = require('./customErrors');
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
     * Check if it is operational
     * @param {Error} err 
     * @return {boolean}
     */
    isTrustedError(err) {
        // if it is a customError type
        if (err instanceof BaseError) {
            return err.isOperational;
        }
        return false;
    }
}
module.exports.errorHandler = new ErrorHandler();
