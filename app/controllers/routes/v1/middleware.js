const {passport} = require('../../authorization/index');
const {isValidUrl} = require('../../aux/index');
const {customErrors} = require('../../error/index');

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
 * middleware to check the params in req.body
 * if they are enough for importHtml
 * @return {function} or redirect
 */
const importHtmlMiddleware = () => {
    return function (req, res, next) {
        if (!req.body.url || !req.body.tag) {
            // throw new Error('test');
            throw new customErrors.BadRequestError('Missing url or tag');
        }
        else if (!isValidUrl(req.body.url)) {
            throw new customErrors.BadRequestError('Invalid url');
        } else {
            return next();
        }
    };
};

/**
 * middleware to check the params in req.body
 * if they are enough for importXml
 * @return {function} or redirect
 */
const importXmlMiddleware = () => {
    return function (req, res, next) {
        if (!req.body.url && !req.body.query) {
            throw new customErrors.BadRequestError('Missing url or query');
        } else {
            return next();
        }
    };
};

module.exports = {
    authMiddleware: authMiddleware,
    importHtmlMiddleware: importHtmlMiddleware,
    importXmlMiddleware: importXmlMiddleware,
};
