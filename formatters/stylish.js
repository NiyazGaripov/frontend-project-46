import _ from 'lodash';

const DEFAULT_INDENT = 2;

const stringify = (node, depth) => {
  if (!_.isObject(node)) {
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

    const lines = node.map(({ key, oldValue, newValue, children, type }) => {
      switch (type) {
        case 'removed':
          return `${currentIndent}- ${key}: ${stringify(newValue, depth + DEFAULT_INDENT)}`;
        case 'added':
          return `${currentIndent}+ ${key}: ${stringify(newValue, depth + DEFAULT_INDENT)}`;
        case 'updated':
          const removedString = `${currentIndent}- ${key}: ${stringify(oldValue, depth + DEFAULT_INDENT)}`;
          const addedString = `${currentIndent}+ ${key}: ${stringify(newValue, depth + DEFAULT_INDENT)}`;
          return `${removedString}\n${addedString}`;
        case 'nested':
          return `${currentIndent}  ${key}: ${iter(children, depth + DEFAULT_INDENT)}`;
        default:
          return `${currentIndent}  ${key}: ${stringify(newValue, depth + DEFAULT_INDENT)}`;
      }
    });

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(tree, 1);
};

export default getStringStylishFormat;
