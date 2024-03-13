const { JSDOM } = require('jsdom');
const logger = require('./logger');

async function crawlAllPages(baseUrl, currentUrl, pages) {
    if (currentUrl === undefined) {
        logger.debug(`\tSKIP - UNDEFINED`);
        return pages;
    }

    const url = normalizeURL(currentUrl, baseUrl);

    if (!url) {
        logger.error(`empty url in ${currentUrl}`);
        return pages;
    }

    if (url.hostname !== baseUrl.hostname) {
        logger.debug(`skip: outside domain - ${url.href}`);
        return pages;
    }

    if (pages[url.href] > 0) {
        pages[url.href]++;
        logger.debug(`${url.href} incremented`);
        return pages;
    }

    pages[url.href] = 1;
    const html = await crawlPage(url);
    const hrefs = extractHrefs(html);
    logger.info(`${url.href} crawled. Recursing...`);

    hrefs.forEach(async (href) => {
        await crawlAllPages(baseUrl, href, pages);
    });

    return pages;
}

async function crawlPage(url) {
    try {
        const res = await fetch(url.href, {
            method: 'GET',
            mode: 'cors',
        });

        if (res.status >= 400) {
            logger.error(`status code ${res.status} in page ${url.href}`);
            return;
        }

        const contentType = res.headers.get('Content-Type');
        if (!contentType.includes('text/html')) {
            logger.debug(`${contentType} is not html in page ${url.href}`);
            return;
        }

        return res.text();
    } catch (e) {
        logger.error(e, e.message);
    }
}

function normalizeURL(href, baseUrl) {
    //undefined
    if (!href) {
        return;
    }

    //absolute path
    if (href.startsWith('http')) {
        return new URL(href);
    }

    //same domain
    if (href.startsWith(baseUrl.href)) {
        return new URL(href);
    }

    //relative path
    if (href.startsWith('/')) {
        const url = new URL(baseUrl.href);
        url.pathname = href;
        return url;
    }
}

function extractHrefs(html) {
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('a');
    const hrefs = Array.from(links).map((a) => a.href);
    return hrefs;
}

module.exports = {
    normalizeURL,
    extractHrefs,
    crawlAllPages,
    crawlPage,
};
