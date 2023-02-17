import path from 'path';
import fs from 'fs';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const genDiff = (filePath1, filePath2) => {
  const dataOfFirstFile = JSON.parse(readFile(filePath1));
  const dataOfSecondFile = JSON.parse(readFile(filePath2));

  return compareData(dataOfFirstFile, dataOfSecondFile);
};
export default genDiff;
