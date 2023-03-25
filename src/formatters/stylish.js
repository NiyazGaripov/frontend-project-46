import _ from 'lodash';

const DEFAULT_INDENT = 2;

const stringify = (node, depth) => {
  if (!_.isPlainObject(node)) {
    return `${node}`;
  }

  const indentSize = depth * DEFAULT_INDENT;
  const currentIndent = ' '.repeat(indentSize + DEFAULT_INDENT);
  const bracketIndent = ' '.repeat(indentSize - DEFAULT_INDENT);
  const lines = Object
    .entries(node)
    .map(([key, value]) => `${currentIndent}${key}: ${stringify(value, depth + DEFAULT_INDENT)}`);

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const getStringStylishFormat = (tree) => {
  const iter = (node, depth) => {
    const indentSize = depth * DEFAULT_INDENT;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - DEFAULT_INDENT);

    const lines = node.map(({
      key, valueFromAnotherDataStructure, nodeValue, children, type,
    }) => {
      switch (type) {
        case 'removed':
          return `${currentIndent}- ${key}: ${stringify(nodeValue, depth + DEFAULT_INDENT)}`;
        case 'added':
          return `${currentIndent}+ ${key}: ${stringify(nodeValue, depth + DEFAULT_INDENT)}`;
        case 'updated': {
          const removedData = `${currentIndent}- ${key}: ${stringify(valueFromAnotherDataStructure, depth + DEFAULT_INDENT)}`;
          const addedData = `${currentIndent}+ ${key}: ${stringify(nodeValue, depth + DEFAULT_INDENT)}`;
          return `${removedData}\n${addedData}`;
        }
        case 'nested':
          return `${currentIndent}  ${key}: ${iter(children, depth + DEFAULT_INDENT)}`;
        default:
          return `${currentIndent}  ${key}: ${stringify(nodeValue, depth + DEFAULT_INDENT)}`;
      }
    });

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(tree, 1);
};

export default getStringStylishFormat;
