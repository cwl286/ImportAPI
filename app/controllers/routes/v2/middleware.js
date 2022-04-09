const passport = require('../../authorization/index').passport;
const {customErrors} = require('../../error/index');
const { Timeframe } = require('../../fetch/ticker/index');


/**
 * authenticate apikey by Passport
 * redirect to '/unauth' if fail
 * otherwise continue
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 * @return {function}
 */
const authApikey = (req, res, next) => {
    // Check "apikey" in req.header or req.body to authorize
    // since passport.authenticate only allow POST
    return passport.authenticate('localapikey', {
        failureRedirect: '/unauth',
    })(req, res, next);
};

/**
 * authenticaion middleware
 * check if having authenticaion session
 * otherwise authenticaite apikey
 * @return {function}
 */
const authMiddleware = () => {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            // check session if it is is authenticated 
            next();
        } else {
            // authenticate now
            // if fail, it will redirect to /api/vi/unauth
            authApikey(req, res, next);
        }
    };
};

/**
 * middleware to check the params in 
 * if they are enough for query
 * @return {function} or redirect
 */
const queryMiddleware = () => {
    return function (req, res, next) {
        if (!req.body.ticker) {
            throw new customErrors.BadRequestError('Missing ticker');
        } else {
            return next();
        }
    };
};

/**
 * middleware to check the params in if they have timeframe for query
 * if they have, preprocess params.
 * @return {function} or redirect
 */
 const queryStatMiddleware = () => {
    return function (req, res, next) {
        if (!req.params['timeFrameInput'] && !req.body.ticker) {
            const msg = 'Missing timeframe or ticker';
            throw new customErrors.BadRequestError(msg);
        } else {
            const keys = Object.keys(Timeframe);
            const input = req.params['timeFrameInput'].toString().toUpperCase();
            req.params['timeframe'] = keys.indexOf(input);
            return next();
        }
    };
};

module.exports = {
    authMiddleware: authMiddleware,
    queryMiddleware: queryMiddleware,
    queryStatMiddleware: queryStatMiddleware,
};
