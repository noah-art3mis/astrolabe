const { JSDOM } = require('jsdom');
const logger = require('./logger');

async function crawlPage(url) {
    try {
        const res = await fetch(url.href, {
            method: 'GET',
            mode: 'cors',
        });

        if (res.status >= 400) {
            logger.error(`status code: ${res.status} in page ${url.href}`);
            return;
        }

        const contentType = res.headers.get('Content-Type');
        if (!contentType.includes('text/html')) {
            logger.error(
                `content type: ${contentType} is not html in page ${url.href}`
            );
            return;
        }

        return res.text();
    } catch (e) {
        logger.error(e, e.message);
    }
}

async function crawlAllPages(baseUrl, currentUrl, pages) {
    if (currentUrl === undefined) {
        logger.info(`\tSKIP - UNDEFINED`);
        return pages;
    }

    const url = normalizeURL(currentUrl, baseUrl);
    const newPage = url ? url.href : baseUrl.href; // hack

    if (url && url.hostname !== baseUrl.hostname) {
        logger.debug(`SKIP - OUTSIDE DOMAIN: ${newPage}`);
        return pages;
    }

    if (pages.includes(newPage)) {
        logger.debug(`SKIP - ALREADY RECORDED ${newPage}`);
        return pages;
    }

    const html = await crawlPage(url);

    pages.push(newPage);
    logger.info(`${newPage} crawled. recursing...`);

    const hrefs = extractHrefs(html, baseUrl);
    for (const href in hrefs) {
        await crawlAllPages(baseUrl, href, pages);
    }
    return pages;
}

function normalizeURL(href, baseUrl) {
    //undefined
    if (!href) {
        logger.error(`bad url: ${href}`);
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

function extractHrefs(html, baseUrl) {
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
