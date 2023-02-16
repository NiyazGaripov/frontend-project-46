import path from 'path';
import fs from 'fs';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const genDiff = (filePath1, filePath2) => {

};
export default genDiff;
