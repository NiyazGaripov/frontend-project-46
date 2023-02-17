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
  let diff = '';

  sortedKeys.forEach(key => {
    if (Object.hasOwn(dataOfFirstFile, key) && (Object.hasOwn(dataOfSecondFile, key)) && dataOfFirstFile[key] === dataOfSecondFile[key]) {
      diff += `\n    ${key}: ${dataOfFirstFile[key]}\n`;
    }

    if (Object.hasOwn(dataOfFirstFile, key) && (Object.hasOwn(dataOfSecondFile, key)) && dataOfFirstFile[key] !== dataOfSecondFile[key]) {
      diff += `\n  - ${key}: ${dataOfFirstFile[key]}\n`;
      diff += `\n  + ${key}: ${dataOfSecondFile[key]}\n`;
    }

    if (Object.hasOwn(dataOfFirstFile, key) && !(Object.hasOwn(dataOfSecondFile, key))) {
      diff += `\n  - ${key}: ${dataOfFirstFile[key]}\n`;
    }

    if (!Object.hasOwn(dataOfFirstFile, key) && (Object.hasOwn(dataOfSecondFile, key))) {
      diff += `\n  + ${key}: ${dataOfSecondFile[key]}\n`;
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
