const { BaseError, BadRequestError, APIError, NotFoundError, UnauthError } = require('./customErrors');

module.exports = {
    BaseError: BaseError,
    BadRequestError: BadRequestError,
    APIError: APIError,
    NotFoundError: NotFoundError,
    UnauthError: UnauthError,
    errorHandler: require('./handler').errorHandler,
};
