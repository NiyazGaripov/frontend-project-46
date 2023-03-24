import path from 'path';
import fs from 'fs';
import parse from './parsers.js';
import buildAST from './ast.js';
import getDataInSpecifiedFormat from '../formatters/index.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const getData = (filePath) => {
  const fileContents = readFile(filePath);
  const fileExtension = path.extname(filePath);

  return parse(fileContents, fileExtension);
};

const genDiff = (filePath1, filePath2, format = 'stylish') => {
  const data1 = getData(filePath1);
  const data2 = getData(filePath2);

  const ast = buildAST(data1, data2);

  return getDataInSpecifiedFormat(ast, format);
};
export default genDiff;
