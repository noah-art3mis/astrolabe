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

    logger.info(`astrolabe start: ${baseUrl.href}`);

    const pages = await crawlAllPages(baseUrl, baseUrl.href, {});

    const pagesArray = Object.entries(pages);
    pagesArray.sort((a, b) => {
        return b[1] - a[1];
    });
    const sortedObject = Object.fromEntries(pagesArray);
    logger.info('astrolabe finished');
    logger.info({ pages: sortedObject });
}

main();
