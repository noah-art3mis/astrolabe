const { getURLsFromHTML, normalizeURL, crawlPage } = require('./crawl.js');
const { argv } = require('node:process');

// https://wagslane.dev

async function main() {
    if (argv.length < 3) {
        throw Error('too few arguments');
    }

    if (argv.length > 3) {
        throw Error('too many arguments');
    }

    const baseUrl = argv[2];
    console.log(`start crawling at ${baseUrl}`);
    const result = await crawlPage(baseUrl);
    console.log(result);
}

main();
