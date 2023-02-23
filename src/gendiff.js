import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const buildDiff = (keys, dataOfFirstFile, dataOfSecondFile) => {
  let diff = '';

  keys.forEach((key) => {
    const valueFromFirstFile = dataOfFirstFile[key];
    const valueFromSecondFile = dataOfSecondFile[key];
    const hasPropertyInFirstFile = Object.hasOwn(dataOfFirstFile, key);
    const hasPropertyInSecondFile = Object.hasOwn(dataOfSecondFile, key);

    if (hasPropertyInFirstFile
      && hasPropertyInSecondFile
      && valueFromFirstFile === valueFromSecondFile) {
      diff += `\n    ${key}: ${valueFromFirstFile}\n`;
    }

    if (hasPropertyInFirstFile
      && hasPropertyInSecondFile
      && valueFromFirstFile !== valueFromSecondFile) {
      diff += `\n  - ${key}: ${valueFromFirstFile}\n`;
      diff += `\n  + ${key}: ${valueFromSecondFile}\n`;
    }

    if (hasPropertyInFirstFile && !hasPropertyInSecondFile) {
      diff += `\n  - ${key}: ${valueFromFirstFile}\n`;
    }

    if (!hasPropertyInFirstFile && hasPropertyInSecondFile) {
      diff += `\n  + ${key}: ${valueFromSecondFile}\n`;
    }
  });

  return `{${diff}}`;
};

const compareData = (dataOfFirstFile, dataOfSecondFile) => {
  const keys = Object.keys({ ...dataOfFirstFile, ...dataOfSecondFile });
  const sortedKeys = _.sortBy(keys);

  return buildDiff(sortedKeys, dataOfFirstFile, dataOfSecondFile);
};

const genDiff = (filePath1, filePath2) => {
  const extensionOfFirstFile = path.extname(filePath1);
  const extensionOfSecondFile = path.extname(filePath2);

  const contentOfFirstFile = readFile(filePath1);
  const contentOfSecondFile = readFile(filePath2);

  const dataOfFirstFile = parse(contentOfFirstFile, extensionOfFirstFile);
  const dataOfSecondFile = parse(contentOfSecondFile, extensionOfSecondFile);

  return compareData(dataOfFirstFile, dataOfSecondFile);
};
export default genDiff;
