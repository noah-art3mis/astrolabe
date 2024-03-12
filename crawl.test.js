const { test, expect } = require('@jest/globals');
const {
    normalizeURL,
    extractHrefs,
    crawlPage,
    crawlAllPages,
} = require('./crawl.js');
const { readFileSync } = require('fs');

describe('normalize url', () => {
    const baseUrl = new URL('https://blog.boot.dev/');

    test('same url', () => {
        const actual = 'https://blog.boot.dev/path/';
        const expected = new URL('https://blog.boot.dev/path/');
        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });

    test('https no slash', () => {
        const CASE_TWO = 'https://blog.boot.dev/path';
        const expected = new URL('https://blog.boot.dev/path/');

        expect(normalizeURL(CASE_TWO, baseUrl)).toStrictEqual(expected);
    });

    test('http with slash', () => {
        const actual = 'http://blog.boot.dev/path/';
        const expected = new URL('https://blog.boot.dev/path/');

        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });

    test('http no slash', () => {
        const actual = 'http://blog.boot.dev/path';
        const expected = new URL('https://blog.boot.dev/path/');

        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });

    test('just slash', () => {
        const actual = '/';
        const expected = new URL('https://blog.boot.dev/path/');

        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });

    test('just path', () => {
        const actual = '/tags/';
        const expected = new URL('https://blog.boot.dev/tags/');
        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });

    test('just path 2', () => {
        const actual = '/tags/zen';
        const expected = new URL('https://blog.boot.dev/tags/zen/');
        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });

    test('file', () => {
        const actual = '/index.xml';
        const expected = new URL('https://blog.boot.dev/index.xml');
        expect(normalizeURL(actual, baseUrl)).toStrictEqual(expected);
    });
});

describe('find links', () => {
    const BASE_URL = new URL('https://boot.dev');

    test('absolute', () => {
        const html =
            '<a href="https://openai.com">Learn Backend Development</a>';
        const actual = extractHrefs(html, BASE_URL);
        const expected = ['https://openai.com/'];
        expect(actual).toStrictEqual(expected);
    });
    test('relative', () => {
        const html = '<a href="/alskdjasd/asda">Learn Backend Development</a>';
        const actual = extractHrefs(html, BASE_URL);
        const expected = ['/alskdjasd/asda'];
        expect(actual).toStrictEqual(expected);
    });

    test('no link', () => {
        const html = '<p> lol</p>';
        const actual = extractHrefs(html, BASE_URL);
        const expected = [];
        expect(actual).toStrictEqual(expected);
    });
});

describe('crawl page', () => {
    test('works', async () => {
        const expected = readFileSync('test_html.txt', 'utf8');
        const actual = crawlPage(new URL('https://wagslane.dev'));
        await expect(actual).resolves.toStrictEqual(expected);
    });
});

describe('crawl all pages', () => {
    const baseUrl = new URL('https://wagslane.dev');

    test('undefined', async () => {
        const expected = [];
        const actual = crawlAllPages(baseUrl, undefined, []);
        await expect(actual).resolves.toStrictEqual(expected);
    });
    test('another domain', async () => {
        const currentUrl = new URL('https://gustavocosta.psc.br');
        const actual = crawlAllPages(baseUrl, currentUrl.href, []);
        await expect(actual).resolves.toStrictEqual([]);
    });

    // test('includes new page', async () => {
    //     const base = new URL('https://wagslane.dev/');
    //     const currentUrl = 'https://wagslane.dev/tags/';
    //     const expected = [{ status: 'crawled', url: currentUrl.href }];
    //     const actual = await crawlAllPages(base, currentUrl, expected);
    //     await expect(actual).resolves.toStrictEqual(expected);
    // });
});
