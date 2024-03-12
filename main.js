const { crawlAllPages } = require('./crawl.js');
const { argv } = require('node:process');
const logger = require('./logger');

// https://wagslane.dev

async function main() {
    if (argv.length < 3) {
        throw Error('too few arguments');
    }

    if (argv.length > 3) {
        throw Error('too many arguments');
    }

    const baseUrl = new URL(argv[2]);

    logger.info(`start crawling at ${baseUrl.href}`);

    const pages = await crawlAllPages(baseUrl, baseUrl.href, []);

    logger.info('=== CRAWLER REPORT START ===');
    pages.forEach((item) => {
        logger.info(`Found links to ${item}`);
    });
    logger.info('=== CRAWLER REPORT END ===');
}

main();
