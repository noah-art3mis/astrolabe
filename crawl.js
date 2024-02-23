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
            return url.href; // not undefined means parsable means absolute link
        } else {
            const newUrl = new URL(baseUrl);
            newUrl.pathname = link;
            return newUrl.href;
        }
    });

    return result;
}

async function crawlPage(url) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });

        if (res.status >= 400) {
            throw Error('status code: ', res.status);
        }

        // if (res.headers.get('Content-Type') != 'text/html') {
        //     throw Error('content type: ', res.res.headers.get('content-type'));
        // }

        return res.text();
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};
