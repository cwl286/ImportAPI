const router = require('express').Router();
const { authMiddleware, importHtmlMiddleware, importXmlMiddleware } = require('./middleware');
const { Feedback } = require('../../../models/index');
const { importHtml, importXML, importJson } = require('./import');

// for passport.authenticate by GET method
// since passport.authenticate only allow POST
router.use((req, res, next) => {
    req.body = { ...req.body, ...req.query, ...req.header };
    next();
});


const htmlResponse = () => {
    return async (req, res, next) => {
        try {
            const msg = await importHtml(req.body.url, req.body.tag, req.body.index);
            res.status(200).json(new Feedback(true, msg));
        } catch (err) {
            next(err);
        }
    };
};

const xmlResponse = () => {
    return async (req, res, next) => {
        try {
            const msg = await importXML(req.body.url, req.body.query);
            res.status(200).json(new Feedback(true, msg));
        } catch (err) {
            next(err);
        }
    };
};

/**
 * Ad hoc API for https://www.1823.gov.hk/common/ical/en.json
 * @return {JSON}
 */
const jsonResponse = () => {
    return async (req, res, next) => {
        try {
            const msg = await importJson();
            res.status(200).json(msg);
        } catch (err) {
            next(err);
        }
    };
};

// "/api/v?/importjson"
router.route('/importjson')
    .get(authMiddleware(),jsonResponse());

// "/api/v?/importhtml"
router.route('/importhtml')
    // merge req.query and req.header to req.body to mimic POST
    .get(authMiddleware(), importHtmlMiddleware(), htmlResponse())
    .post(authMiddleware(), importHtmlMiddleware(), htmlResponse());

// "/api/v?/importxml"
router.route('/importxml')
    // merge req.query and req.header to req.body to mimic POST
    .get(authMiddleware(), importXmlMiddleware(), xmlResponse())
    .post(authMiddleware(), importXmlMiddleware(), xmlResponse());


module.exports = router;
