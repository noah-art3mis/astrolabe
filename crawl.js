const { JSDOM } = require('jsdom');

function normalizeURL(oldUrl) {
    const newUrl = new URL(oldUrl);
    let result = `${newUrl.hostname}${newUrl.pathname}`;
    return removeTrailingSlash(result);
}

function removeTrailingSlash(str) {
    return str.endsWith('/') ? str.slice(0, -1) : str;
}

function getURLsFromHTML(html, baseUrl) {
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('a');
    const hrefs = Array.from(links).map((a) => a.href);
    const result = hrefs.map((link) => {
        let url;

        try {
            url = new URL(link);
        } catch (e) {
            console.log(e);
            url = undefined;
        }

        if (url) {
            return url; // not undefined means parsable means absolute link
        } else {
            const newUrl = new URL(baseUrl.href);
            newUrl.pathname = link;
            return newUrl;
        }
    });

    return result;
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
        pages.push({ url: currentUrl.href, status: 'undefined' });
        console.log(`${currentUrl.href} is undefined`);
        return;
    }

    if (currentUrl.hostname != baseUrl.hostname) {
        pages.push({ url: currentUrl.href, status: 'not crawled' });
        console.log(`${currentUrl.href} is outside domain. skipping`);
        return;
    }

    const html = await crawlPage(currentUrl);

    const urls = getURLsFromHTML(html, baseUrl);

    pages.push({ url: currentUrl.href, status: 'crawled' });
    console.log(`${currentUrl.href} crawled. recursing`);

    urls.forEach((url) => {
        crawlAllPages(baseUrl, url, pages);
    });
    return pages;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlAllPages,
    crawlPage
};
