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
    const linkList = dom.window.document.querySelectorAll('a');
    const hrefs = Array.from(linkList).map((a) => a.href);

    const result = hrefs.map((a) => {
        if (a.slice(0, 1) === '/') {
            return baseUrl + a;
        } else {
            return a;
        }
    });
    return result;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
};
