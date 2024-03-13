const { crawlAllPages } = require('./crawl.js');
const { argv } = require('node:process');
const logger = require('./logger');

async function main() {
    if (argv.length < 3) {
        throw Error('too few arguments');
    }

    if (argv.length > 3) {
        throw Error('too many arguments');
    }

    const baseUrl = new URL(argv[2]);

    logger.info(`start crawling at ${baseUrl.href}`);

    try {
        const pages = await crawlAllPages(baseUrl, baseUrl.href, {});
        logger.info(pages);
    } catch (e) {
        logger.error(e, e.message);
    }
}

main();
