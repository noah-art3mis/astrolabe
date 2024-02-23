const { crawlAllPages } = require('./crawl.js');
const { argv } = require('node:process');

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
    const pages = await crawlAllPages(baseUrl, baseUrl, []);
    
    console.log('end crawling. pages:');
    console.log(pages);
}

main();
