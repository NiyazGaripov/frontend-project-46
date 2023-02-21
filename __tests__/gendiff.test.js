import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const filePath1 = getFixturePath('file1.json');
const filePath2 = getFixturePath('file2.json');
const expected = readFile('expected.txt').toString().trim();

test('should to get diff between two files', () => {
  expect(genDiff(filePath1, filePath2)).toStrictEqual(expected);
});

test('should to get exception', () => {
  expect(() => genDiff('', '')).toThrow();
  expect(() => genDiff('')).toThrow();
  expect(() => genDiff()).toThrow();
});