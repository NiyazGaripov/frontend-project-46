import path from 'path';
import fs from 'fs';
import _ from 'lodash';

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
  const dataOfFirstFile = JSON.parse(readFile(filePath1));
  const dataOfSecondFile = JSON.parse(readFile(filePath2));

  return compareData(dataOfFirstFile, dataOfSecondFile);
};
export default genDiff;
