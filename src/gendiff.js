import path from 'path';
import fs from 'fs';
import parse from './parsers.js';
import buildAST from './ast.js';
import formatting from './formatters.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const getDataFromFile = (filePath) => {
  const fileContents = readFile(filePath);
  const fileExtension = path.extname(filePath);

  return parse(fileContents, fileExtension);
};

const genDiff = (filePath1, filePath2, format = 'stylish') => {
  const dataFromFirstFile = getDataFromFile(filePath1);
  const dataFromSecondFile = getDataFromFile(filePath2);

  const ast = buildAST(dataFromFirstFile, dataFromSecondFile);

  return formatting(ast, format);
};
export default genDiff;
