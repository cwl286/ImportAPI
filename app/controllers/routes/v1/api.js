const router = require('express').Router();
const { authMiddleware, importHtmlMiddleware, importXmlMiddleware } = require('./middleware');
const factory = require('../feedback');

// for passport.authenticate by GET method
// since passport.authenticate only allow POST
router.use((req, res, next) => {
    req.body = { ...req.body, ...req.query, ...req.header };
    next();
});


const htmlResponse = () => {
    return async (req, res, next) => {
        try {
            const {importHtml} = require('../../fetch/index');
            const msg = await importHtml(req.body.url, req.body.tag, req.body.index);
            res.status(200).json(new factory.Message(true, msg));
        } catch (err) {
            console.error(err);
            next(err);
        }
    };
};

const xmlResponse = () => {
    return async (req, res, next) => {
        try {
            const { importXml } = require('../../fetch/import');
            const msg = await importXml(req.body.url, req.body.query);
            res.status(200).json(new factory.Message(true, msg));
        } catch (err) {
            console.error(err);
            next(err);
        }
   };
};


// "/api/v?/account"
router.route('/importhtml')
    // merge req.query and req.header to req.body to mimic POST
    .get(authMiddleware(), importHtmlMiddleware(), htmlResponse())
    .post(authMiddleware(), importHtmlMiddleware(), htmlResponse());

// "/api/v?/importxml"
router.route('/importxml')
    // merge req.query and req.header to req.body to mimic POST
    .get(authMiddleware(), importXmlMiddleware(), xmlResponse())
    .post(authMiddleware(), importXmlMiddleware(), xmlResponse());

// "/api/v?/fail"
router.get('/fail', (req, res, next) => {
    res.status(400).json(factory.failQuery).end();
});

// "/api/v?/unauth"
router.get('/unauth', (req, res, next) => {
    res.status(401).json(factory.unauth).end();
});

module.exports = router;
