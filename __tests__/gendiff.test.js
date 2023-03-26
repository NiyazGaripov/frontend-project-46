import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));
const getExpectedResult = (filename) => readFile(filename).toString().trim();

const jsonPath1 = getFixturePath('file1.json');
const jsonPath2 = getFixturePath('file2.json');
const yamlPath1 = getFixturePath('file1.yml');
const yamlPath2 = getFixturePath('file2.yml');
const expectedStylish = getExpectedResult('expected-stylish.txt');
const expectedPlain = getExpectedResult('expected-plain.txt');
const expectedJson = getExpectedResult('expected.json');

const testCases = [
  { format: 'stylish', expected: expectedStylish },
  { format: 'plain', expected: expectedPlain },
  { format: 'json', expected: expectedJson },
];

test.each(testCases)('should to get diff between two files', ({ format, expected }) => {
  expect(genDiff(jsonPath1, jsonPath2, format)).toStrictEqual(expected);
  expect(genDiff(yamlPath1, yamlPath2, format)).toStrictEqual(expected);
  expect(genDiff(jsonPath1, yamlPath2, format)).toStrictEqual(expected);
});

test('should to get exception', () => {
  expect(() => genDiff('', '', 'plain')).toThrow();
  expect(() => genDiff(jsonPath1, jsonPath2, 'plai')).toThrow();
  expect(() => genDiff('', '')).toThrow();
  expect(() => genDiff('')).toThrow();
  expect(() => genDiff()).toThrow();
});
