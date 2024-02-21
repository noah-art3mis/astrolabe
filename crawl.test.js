const { test, expect } = require('@jest/globals');
const { normalizeURL } = require('./crawl.js');

const CASE_ONE = 'https://blog.boot.dev/path/';
const CASE_TWO = 'https://blog.boot.dev/path';
const CASE_THREE = 'http://blog.boot.dev/path/';
const CASE_FOUR = 'http://blog.boot.dev/path';
const RESULT = 'blog.boot.dev/path';

test('normalize https with slash', () => {
    expect(normalizeURL(CASE_ONE)).toBe(RESULT);
});

test('normalize https no slash', () => {
    expect(normalizeURL(CASE_TWO)).toBe(RESULT);
});

test('normalize http with slash', () => {
    expect(normalizeURL(CASE_THREE)).toBe(RESULT);
});

test('normalize http no slash', () => {
    expect(normalizeURL(CASE_FOUR)).toBe(RESULT);
});
