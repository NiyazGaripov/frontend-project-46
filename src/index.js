import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const compareData = (dataOfFirstFile, dataOfSecondFile) => {
  const keys = Object.keys({...dataOfFirstFile, ...dataOfSecondFile});
  const sortedKeys = _.sortBy(keys);
  const valueFromFirstFile = dataOfFirstFile[key];
  const valueFromSecondFile = dataOfSecondFile[key];
  let diff = '';

  sortedKeys.forEach(key => {
    if (Object.hasOwn(dataOfFirstFile, key) && (Object.hasOwn(dataOfSecondFile, key)) && valueFromFirstFile === valueFromSecondFile) {
      diff += `\n    ${key}: ${valueFromFirstFile}\n`;
    }

    if (Object.hasOwn(dataOfFirstFile, key) && (Object.hasOwn(dataOfSecondFile, key)) && valueFromFirstFile !== valueFromSecondFile) {
      diff += `\n  - ${key}: ${valueFromFirstFile}\n`;
      diff += `\n  + ${key}: ${valueFromSecondFile}\n`;
    }

    if (Object.hasOwn(dataOfFirstFile, key) && !(Object.hasOwn(dataOfSecondFile, key))) {
      diff += `\n  - ${key}: ${valueFromFirstFile}\n`;
    }

    if (!Object.hasOwn(dataOfFirstFile, key) && (Object.hasOwn(dataOfSecondFile, key))) {
      diff += `\n  + ${key}: ${valueFromSecondFile}\n`;
    }
  });

  return `{${diff}}`;
};

const genDiff = (filePath1, filePath2) => {
  const dataOfFirstFile = JSON.parse(readFile(filePath1));
  const dataOfSecondFile = JSON.parse(readFile(filePath2));

  return compareData(dataOfFirstFile, dataOfSecondFile);
};
export default genDiff;
