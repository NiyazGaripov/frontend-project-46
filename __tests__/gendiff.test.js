import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const jsonFilePath1 = getFixturePath('file1.json');
const jsonFilePath2 = getFixturePath('file2.json');
const yamlFilePath1 = getFixturePath('file1.yml');
const yamlFilePath2 = getFixturePath('file2.yml');
const expectedStylish = readFile('expected-stylish.txt').toString().trim();

test('should to get diff between two files', () => {
  expect(genDiff(jsonFilePath1, jsonFilePath2)).toStrictEqual(expectedStylish);
  expect(genDiff(yamlFilePath1, yamlFilePath2)).toStrictEqual(expectedStylish);
  expect(genDiff(jsonFilePath1, yamlFilePath2)).toStrictEqual(expectedStylish);
});

test('should to get diff between two files in stylish format', () => {
  expect(genDiff(jsonFilePath1, jsonFilePath2, 'stylish')).toStrictEqual(expectedStylish);
  expect(genDiff(yamlFilePath1, yamlFilePath2, 'stylish')).toStrictEqual(expectedStylish);
  expect(genDiff(jsonFilePath1, yamlFilePath2, 'stylish')).toStrictEqual(expectedStylish);
});

test('should to get exception', () => {
  expect(() => genDiff('', '')).toThrow();
  expect(() => genDiff('')).toThrow();
  expect(() => genDiff()).toThrow();
});
