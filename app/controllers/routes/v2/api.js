const router = require('express').Router();
const { authMiddleware, queryMiddleware } = require('./middleware');
const Feedback = require('../../feedback');
const { queryRatio, queryProfile } = require('./query');

// for passport.authenticate by GET method
// since passport.authenticate only allow POST
router.use((req, res, next) => {
    req.body = { ...req.body, ...req.query, ...req.header };
    next();
});


const responseRatio = () => {
    return async (req, res, next) => {
        try {
            const data = await queryRatio(req.body.ticker);
            res.status(200).json(new Feedback(true, data));
        } catch (err) {
            next(err);
        }
    };
};

const responseProfile = () => {
    return async (req, res, next) => {
        try {
            const data = await queryProfile(req.body.ticker);
            res.status(200).json(new Feedback(true, data));
        } catch (err) {
            next(err);
        }
    };
};

// "/api/v?/queryticker"
router.route('/queryticker')
    // merge req.query and req.header to req.body to mimic POST
    .get(authMiddleware(), queryMiddleware(), responseRatio())
    .post(authMiddleware(), queryMiddleware(), responseRatio());

// "/api/v?/queryprofile"
router.route('/queryprofile')
    // merge req.query and req.header to req.body to mimic POST
    .get(authMiddleware(), queryMiddleware(), responseProfile())
    .post(authMiddleware(), queryMiddleware(), responseProfile());

module.exports = router;
