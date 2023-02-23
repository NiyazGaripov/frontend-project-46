import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { expect, test } from '@jest/globals';
import yaml from 'js-yaml';
import parse from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const contentOfJsonFile = readFile('file1.json');
const contentOfYamlFile = readFile('file2.yml');
const extensionJson = path.extname('file1.json');
const extensionYaml = path.extname('file2.yml');
const expectedJson = JSON.parse(contentOfJsonFile.toString());
const expectedYaml = yaml.load(contentOfYamlFile);

test('should to parse data', () => {
  expect(parse(contentOfJsonFile, extensionJson)).toStrictEqual(expectedJson);
  expect(parse(contentOfYamlFile, extensionYaml)).toStrictEqual(expectedYaml);
});
