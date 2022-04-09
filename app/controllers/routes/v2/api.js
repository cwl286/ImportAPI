const router = require('express').Router();
const { authMiddleware, queryMiddleware, queryStatMiddleware } = require('./middleware');
const Feedback = require('../../feedback');
const { queryRatio, queryCurrentRatio, queryProfile, queryStatement } = require('./query');

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

const responseCurrentRatio = () => {
    return async (req, res, next) => {
        try {
            const data = await queryCurrentRatio(req.body.ticker);
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

const responeStatement = () => {
    return async (req, res, next) => {
        try {
            // res.params['timeframe] is created in queryStatMiddleware()
            const data = await queryStatement(req.body.ticker, req.params['timeframe']);
            res.status(200).json(new Feedback(true, data));
        } catch (err) {
            next(err);
        }
    };
};

// "/api/v?/queryticker"
router.route('/queryticker')
    .get(authMiddleware(), queryMiddleware(), responseRatio())
    .post(authMiddleware(), queryMiddleware(), responseRatio());

// "/api/v?/queryticker/current"
router.route('/queryticker/current')
    .get(authMiddleware(), queryMiddleware(), responseCurrentRatio())
    .post(authMiddleware(), queryMiddleware(), responseCurrentRatio());

// "/api/v?/queryprofile"
router.route('/queryprofile')
    .get(authMiddleware(), queryMiddleware(), responseProfile())
    .post(authMiddleware(), queryMiddleware(), responseProfile());

// "/api/v?/querystatement/:timeFrameInput"
router.route('/querystatement*/:timeFrameInput')
    .get(authMiddleware(), queryStatMiddleware(), responeStatement())
    .post(authMiddleware(), queryStatMiddleware(), responeStatement());


module.exports = router;
