const { crawlAllPages } = require('./crawl.js');
const { argv } = require('node:process');
const logger = require('./logger');
const retry = require('retry');
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

    const pages = await crawlAllPages(baseUrl, baseUrl.href, {});

    for (const page in pages) {
        logger.info(`Found ${page[1]} links to ${page[0]}`);
    }
}

main();
