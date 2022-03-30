const passport = require('passport');
const LocalStrategy = require('passport-localapikey-update').Strategy;
const { apikeys } = require('../../models/index');

/**
 * find user id by api key
 * @param {string} key - api key
 * @param {*} callback
 * @return {callback}
 */
function findByKey(key, callback) {
    const id = apikeys.get(key);
    if (id) {
        return callback(null, id);
    }
    return callback(null);
}

/**
 * serialize to store in session store
 */
passport.serializeUser(function (apikey, callback) {
    callback(null, apikey);
});

/**
 * deserialize to get back from session store
 */
passport.deserializeUser(function (apikey, callback) {
    findByKey(apikey, function (err, id) {
        callback(err, apikey);
    });
});


/**
 * initialize passport
 * Check 'apikey' in req.header or req.body to authorize
 * Save apikey in session instead of user id as usual
 * @param {*} app 
 */
function init(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(
        (apikey, done) => {
            findByKey(apikey, (err, id) => {
                if (err) {
                    return done(err);
                }
                if (!id) {
                    return done(null, false);
                }
                // save apikey in session instead of user id
                return done(null, apikey);
            });
        },
    ));
}

module.exports = {
    init: init,
    passport: passport,
};
