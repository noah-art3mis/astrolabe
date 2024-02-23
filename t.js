const { readFileSync } = require('fs');

const expected = readFileSync('output.txt', 'utf8');

console.log(expected);
