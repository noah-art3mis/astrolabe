const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl.js');

const RESULT = 'blog.boot.dev/path';
const BASE_URL = 'https://boot.dev';

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

test('find link absolute', () => {
    const html = '<a href="https://openai.com">Learn Backend Development</a>';
    const actual = getURLsFromHTML(html, BASE_URL);
    const expected = ['https://openai.com/'];
    expect(actual).toStrictEqual(expected);
});

test('find link relative', () => {
    const html = '<a href="/alskdjasd/asda">Learn Backend Development</a>';
    const actual = getURLsFromHTML(html, BASE_URL);
    const expected = ['https://boot.dev/alskdjasd/asda'];
    expect(actual).toStrictEqual(expected);
});

test('find link relative and absolute', () => {
    const html =
        '<a href="/alskdjasd/asda">Learn Backend Development</a> <a href="https://aaaaa/2222/22">Learn Backend Development</a>';

    const actual = getURLsFromHTML(html, BASE_URL);

    const expected = [
        'https://boot.dev/alskdjasd/asda',
        'https://aaaaa/2222/22',
    ];

    expect(actual).toStrictEqual(expected);
});

test('find no link', () => {
    const html = '<p> lol</p>';

    const actual = getURLsFromHTML(html, BASE_URL);

    const expected = [];

    expect(actual).toStrictEqual(expected);
});
