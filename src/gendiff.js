import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath).toString();
};

const makeInternalNode = (name, type, children, state) => ({
  name,
  type,
  children,
  state,
});

const makeLeafNode = (name, type, value, state) => ({
  name,
  type,
  value,
  state,
});

const buildAST = (dataOfFirstFile, dataOfSecondFile) => {
  const keys = Object.keys({ ...dataOfFirstFile, ...dataOfSecondFile });
  const sortedKeys = _.sortBy(keys);
  const tree = [];

  sortedKeys.forEach((key) => {
    const valueFromFirstFile = dataOfFirstFile[key];
    const valueFromSecondFile = dataOfSecondFile[key];
    const hasPropertyInFirstFile = Object.hasOwn(dataOfFirstFile, key);
    const hasPropertyInSecondFile = Object.hasOwn(dataOfSecondFile, key);

    if (hasPropertyInFirstFile && !hasPropertyInSecondFile) {
      const node = makeLeafNode(key, 'leaf', valueFromFirstFile, '-');
      tree.push(node);
    } else if (!hasPropertyInFirstFile && hasPropertyInSecondFile) {
      const node = makeLeafNode(key, 'leaf', valueFromSecondFile, '+');
      tree.push(node);
    } else if ((!_.isObject(valueFromFirstFile) || !_.isObject(valueFromSecondFile)) && valueFromFirstFile !== valueFromSecondFile) {
      const nodeFromFirstFile = makeLeafNode(key, 'leaf', valueFromFirstFile, '-');
      const nodeFromSecondFile = makeLeafNode(key, 'leaf', valueFromSecondFile, '+');
      tree.push(nodeFromFirstFile);
      tree.push(nodeFromSecondFile);
    } else if (valueFromFirstFile === valueFromSecondFile) {
      const node = makeLeafNode(key, 'leaf', valueFromFirstFile, ' ');
      tree.push(node);
    } else if (_.isObject(valueFromFirstFile) && _.isObject(valueFromSecondFile)) {
      const children = buildAST(valueFromFirstFile, valueFromSecondFile);

      const node = makeInternalNode(key, 'internal', children,' ');

      tree.push(node);
    }
  });

  return tree;
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
    const { name, type, children, value, state } = node;

    if (type === 'internal') {
      return `${state} ${name}: ${formatting(children)}`;
    }

    if (type === 'leaf') {
      return `${state} ${name}: ${stringify(value, ' ', 4)}`;
    }

    return  node;
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

  return buildAST(dataOfFirstFile, dataOfSecondFile);
};
export default genDiff;
