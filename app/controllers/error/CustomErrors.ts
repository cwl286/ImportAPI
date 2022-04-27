enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    AUANTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

/**
 * Base error class
 */
class BaseError extends Error {
    protected httpCode: HttpStatusCode;
    protected isOperational: boolean;

    /**
     * @param {string} name 
     * @param {string} description 
     * @param {boolean} isOperational
     * @param {HttpStatusCode} httpCode 
     */
    constructor(name:string, description: string, isOperational: boolean, httpCode: HttpStatusCode) {
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
    constructor(name: string, description = 'Internal Server Error',
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

export { BaseError, APIError, BadRequestError, UnauthError, NotFoundError };
