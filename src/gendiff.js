import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers.js';
import buildAST from './ast.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, 1);
};

const formatting = (tree) => {
  const diff = tree.map((node) => {
    const {
      name, type, children, value, state,
    } = node;

    if (type === 'internal') {
      return `${state} ${name}: ${formatting(children)}`;
    }

    if (type === 'leaf') {
      return `${state} ${name}: ${stringify(value, ' ', 4)}`;
    }

    return node;
  });

  return diff.join('\n');
};

const genDiff = (filePath1, filePath2, format = 'stylish') => {
  const extensionOfFirstFile = path.extname(filePath1);
  const extensionOfSecondFile = path.extname(filePath2);

  const contentOfFirstFile = readFile(filePath1);
  const contentOfSecondFile = readFile(filePath2);

  const dataOfFirstFile = parse(contentOfFirstFile, extensionOfFirstFile);
  const dataOfSecondFile = parse(contentOfSecondFile, extensionOfSecondFile);

  const ast = buildAST(dataOfFirstFile, dataOfSecondFile);

  return formatting(ast);
};
export default genDiff;
