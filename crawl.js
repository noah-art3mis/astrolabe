const { JSDOM } = require('jsdom');

function extractHrefs(html, baseUrl) {
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('a');
    const hrefs = Array.from(links).map((a) => a.href);
    return hrefs;
}

async function crawlPage(url) {
    try {
        const res = await fetch(url.href, {
            method: 'GET',
            mode: 'cors',
        });

        if (res.status >= 400) {
            throw Error(`status code: ${res.status} in page ${url.href}`);
        }

        const contentType = res.headers.get('Content-Type');
        if (!contentType.includes('text/html')) {
            throw Error(
                `content type: ${contentType} is not html in page ${url.href}`
            );
        }

        return res.text();
    } catch (e) {
        console.log(e);
    }
}

async function crawlAllPages(baseUrl, currentUrl, pages) {
    if (currentUrl === undefined) {
        console.log(`\tSKIP - UNDEFINED`);
        return pages;
    }

    const url = normalizeURL(currentUrl, baseUrl);
    const newPage = url ? url.href : baseUrl.href; // hack

    if (url && url.hostname != baseUrl.hostname) {
        console.log(`\tSKIP - OUTSIDE DOMAIN: ${newPage}`);
        return pages;
    }

    if (pages.includes(newPage)) {
        console.log(`\tSKIP - ALREADY RECORDED ${newPage}`);
        return pages;
    }

    const html = await crawlPage(url);

    pages.push(newPage);
    console.log(`${newPage} crawled. recursing...`);

    extractHrefs(html, baseUrl).forEach((href) => {
        crawlAllPages(baseUrl, href, pages);
    });

    return pages;
}

function normalizeURL(href, baseUrl) {
    //undefined
    if (!href) {
        console.log(`bad url: ${href}`);
        return baseUrl; // ? hack
    }

    //absolute path
    if (href.startsWith('http')) {
        return new URL(href);
    }

    //same domain
    if (href.startsWith(baseUrl)) {
        return new URL(href);
    }

    //relative - home
    if (href === '/') {
        return baseUrl;
    }

    //relative - file
    if (href.endsWith('.xml')) {
        const url = new URL(baseUrl.href);
        url.pathname = href;
        return url;
    }

    //relative path
    if (href.startsWith('/')) {
        const url = new URL(baseUrl.href);
        url.pathname = href;
        return url;
    }
}

function printReport(pages) {
    report = [];

    const sorted = pages;
    // const sorted = pages.sort((a.count, b.count) => {
    //     return b.count - a.count;
    // });

    report.push('=== CRAWLER REPORT START ===');
    console.log('=== CRAWLER REPORT START ===');

    sorted.forEach((item) => {
        report.push(`Found links to ${item}`);
        console.log(`Found links to ${item}`);
    });

    report.push('=== CRAWLER REPORT END ===');
    console.log('=== CRAWLER REPORT END ===');

    try {
        writeFileSync('report.txt', report.toString());
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    normalizeURL,
    extractHrefs,
    crawlAllPages,
    crawlPage,
    printReport,
};
