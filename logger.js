const pino = require('pino');

const DEFAULT_LEVEL = 'debug';
// const DEFAULT_LEVEL = 'info';

const transport = pino.transport({
    targets: [
        {
            target: 'pino/file',
            options: { destination: `${__dirname}/app.log` },
            level: DEFAULT_LEVEL,
        },
        {
            target: 'pino-pretty',
            level: DEFAULT_LEVEL,
        },
    ],
});

const logger = pino({}, transport);
logger.level = DEFAULT_LEVEL;
module.exports = logger;
