const winston = require('winston');
const logger = require('.');

const config = require('../../config/index').config;

const myCustomLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    }
};

const transports = [
    new winston.transports.Console({
        level: 'error'
    }),
    new winston.transports.File({
        filename: config.logger.errorDir || './logs/error.log',
        level: 'error'
    }),
];
// Log more information
if (config.env != 'production') {
    transports.push(new winston.transports.File({
        filename: config.logger.infoDir || './info.log',
        level: 'info'
    }));    
}

/**
 * Logger by winston
 */
class Logger {
    /**
     * Creete winston logger
     */
    constructor() {
        this._logger = winston.createLogger({
            level: config.env == 'production' ? 'error' : 'info',
            levels: myCustomLevels.levels,
            format: winston.format.json(),
            // defaultMeta: { meta: 'default-meta' },
            transports: transports,
            exitOnError: false,
        });
        winston.addColors(myCustomLevels.colors);
    }

    /**
     * level 5
     * @param {string} msg 
     * @param {object} meta 
     */
    trace(msg, meta) {
        this._logger.trace(msg, meta);
    }

    /**
     * level 4
     * @param {string} msg 
     * @param {object} meta 
     */
    debug(msg, meta) {
        this._logger.debug(msg, meta);
    }

    /**
     * level 3
     * @param {string} msg 
     * @param {object} meta 
     */
    info(msg, meta) {
        this._logger.info(msg, meta);
    }

    /**
     * level 2
     * @param {string} msg 
     * @param {object} meta 
     */
    warn(msg, meta) {
        this._logger.warn(msg, meta);
    }

    /**
     * level 1
     * @param {string} msg 
     * @param {object} meta 
     */
    error(msg, meta) {
        this._logger.error(msg, meta);
    }

    /**
     * level 0
     * @param {string} msg 
     * @param {object} meta 
     */
    fatal(msg, meta) {
        this._logger.fatal(msg, meta);
    }
}

module.exports = new Logger();
