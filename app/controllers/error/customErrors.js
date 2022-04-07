const HttpStatusCode = require('./HttpStatusCode');

/**
 * Base error class
 */
class BaseError extends Error {
    /**
     * @param {string} name 
     * @param {string} description 
     * @param {boolean} isOperational
     * @param {HttpStatusCode} httpCode 
     */
    constructor(name, description, isOperational, httpCode) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

/**
     * API error class
 */
class APIError extends BaseError {
    /**
     * @param {string} name 
     * @param {string} description (optional)
     * @param {boolean} isOperational (optional)
     * @param {INTERNAL_SERVER} httpCode (optional)
     */
    constructor(name, description = 'Internal Server Error',
        isOperational = false, httpCode = HttpStatusCode.INTERNAL_SERVER) {
        super(name, description, isOperational, httpCode);
    }
}

/**
     * 400 Bad Request error class
 */
class BadRequestError extends BaseError {
    /**
     * @param {string} description (optional)
     */
    constructor(description = 'Fail to query!') {
        super('Bad Request', description, true, HttpStatusCode.BAD_REQUEST);
    }
}

/**
 * 401 Unauthorized error class
 */
class UnauthError extends BaseError {
    /**
     * @param {string} description (optional)
     */
    constructor(description = 'Fail to authenticate apikey!') {
        super('Unauthorized', description, true, HttpStatusCode.AUANTHORIZED);

    }
}

/**
 * 404 Not Found error class
 */
class NotFoundError extends BaseError {
    /**
     * @param {string} description (optional)
     */
    constructor(description = 'Page not Found') {
        super('Not Found', description, true, HttpStatusCode.NOT_FOUND);
    }
}

module.exports = {
    BaseError: BaseError,
    APIError: APIError,
    BadRequestError: BadRequestError,
    UnauthError: UnauthError,
    NotFoundError: NotFoundError,
};
