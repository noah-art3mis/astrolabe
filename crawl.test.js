const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl.js');

describe('normalize url', () => {
    const RESULT = 'blog.boot.dev/path';

    test('normalize https with slash', () => {
        const CASE_ONE = 'https://blog.boot.dev/path/';
        expect(normalizeURL(CASE_ONE)).toBe(RESULT);
    });

    test('normalize https no slash', () => {
        const CASE_TWO = 'https://blog.boot.dev/path';
        expect(normalizeURL(CASE_TWO)).toBe(RESULT);
    });

    test('normalize http with slash', () => {
        const CASE_THREE = 'http://blog.boot.dev/path/';
        expect(normalizeURL(CASE_THREE)).toBe(RESULT);
    });

    test('normalize http no slash', () => {
        const CASE_FOUR = 'http://blog.boot.dev/path';
        expect(normalizeURL(CASE_FOUR)).toBe(RESULT);
    });
});

describe('find links', () => {
    const BASE_URL = new URL('https://boot.dev');

    test('absolute', () => {
        const html =
            '<a href="https://openai.com">Learn Backend Development</a>';
        const actual = getURLsFromHTML(html, BASE_URL);
        const expected = [new URL('https://openai.com/')];
        expect(actual).toStrictEqual(expected);
    });
    test('relative', () => {
        const html = '<a href="/alskdjasd/asda">Learn Backend Development</a>';
        const actual = getURLsFromHTML(html, BASE_URL);
        const expected = [new URL('https://boot.dev/alskdjasd/asda')];
        expect(actual).toStrictEqual(expected);
    });

    test('relative and absolute', () => {
        const html =
            '<a href="/alskdjasd/asda">Learn Backend Development</a> <a href="https://aaaaa.etc/2222/22">Learn Backend Development</a>';

        const actual = getURLsFromHTML(html, BASE_URL);

        const expected = [
            new URL('https://boot.dev/alskdjasd/asda'),
            new URL('https://aaaaa.etc/2222/22'),
        ];

        expect(actual).toStrictEqual(expected);
    });

    test('no link', () => {
        const html = '<p> lol</p>';

        const actual = getURLsFromHTML(html, BASE_URL);

        const expected = [];

        expect(actual).toStrictEqual(expected);
    });
});
