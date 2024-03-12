const { crawlAllPages, printReport } = require('./crawl.js');
const { argv } = require('node:process');
const { writeFileSync } = require('fs');

// https://wagslane.dev

async function main() {
    if (argv.length < 3) {
        throw Error('too few arguments');
    }

    if (argv.length > 3) {
        throw Error('too many arguments');
    }

    const baseUrl = new URL(argv[2]);

    console.log(`start crawling at ${baseUrl.href}`);

    let pages;

    try {
        pages = await crawlAllPages(baseUrl, baseUrl.href, []);
    } catch (err) {
        console.error(err);
    }

    console.log('end crawling.');

    printReport(pages);
}

main();
