const { JSDOM } = require('jsdom');

function normalizeURL(href, baseUrl) {
    //undefined
    if (!href) {
        throw Error('bad url');
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

async function crawlPage(url) {
    try {
        const res = await fetch(url.href, {
            method: 'GET',
            mode: 'cors',
        });

        if (res.status >= 400) {
            throw Error('status code: ', res.status);
        }

        return res.text();
    } catch (e) {
        console.log(e);
    }
}

async function crawlAllPages(baseUrl, currentUrl, pages) {
    if (currentUrl === undefined) {
        pages.push({ url: currentUrl, status: 'undefined' });
        console.log(`${currentUrl} is undefined`);
        return pages;
    }

    const url = normalizeURL(currentUrl, baseUrl);
    const newPage = { status: 'crawled', url: url };

    if (url.hostname != baseUrl.hostname) {
        pages.push({ url: url.href, status: 'not crawled' });
        console.log(`${url.href} is outside domain. skipping`);
        return pages;
    }

    if (pages.includes(newPage)) {
        console.log(`${url.href} is already recorded. skipping`);
        return pages;
    }

    const html = await crawlPage(url);

    pages.push({ url: url.href, status: 'crawled' });
    console.log(`${url.href} crawled. recursing`);

    extractHrefs(html, baseUrl).forEach((href) => {
        crawlAllPages(baseUrl, href, pages);
    });

    return pages;
}

module.exports = {
    normalizeURL,
    extractHrefs,
    crawlAllPages,
    crawlPage,
};
