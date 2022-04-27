const { BaseError, APIError, BadRequestError, UnauthError, NotFoundError } = require('./CustomErrors.ts');

module.exports = {
    BaseError: BaseError, 
    APIError: APIError,
    BadRequestError: BadRequestError, 
    UnauthError: UnauthError,
    NotFoundError: NotFoundError,
    errorHandler: require('./handler').errorHandler,
};
