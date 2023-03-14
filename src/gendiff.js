import path from 'path';
import fs from 'fs';
import parse from './parsers.js';
import buildAST from './ast.js';
import formatting from './formatters.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const genDiff = (filePath1, filePath2, format = 'stylish') => {
  const extensionOfFirstFile = path.extname(filePath1);
  const extensionOfSecondFile = path.extname(filePath2);

  const contentOfFirstFile = readFile(filePath1);
  const contentOfSecondFile = readFile(filePath2);

  const dataOfFirstFile = parse(contentOfFirstFile, extensionOfFirstFile);
  const dataOfSecondFile = parse(contentOfSecondFile, extensionOfSecondFile);

  const ast = buildAST(dataOfFirstFile, dataOfSecondFile);

  return formatting(ast, format);
};
export default genDiff;
