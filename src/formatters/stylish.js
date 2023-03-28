import _ from 'lodash';

const makeIndent = (depth, hasOffsetToLeft = false, replacer = ' ') => {
  const INDENT_COUNT = 4;
  const OFFSET_TO_LEFT = 2;
  const indentSize = depth * INDENT_COUNT;

  return hasOffsetToLeft
    ? replacer.repeat(indentSize - OFFSET_TO_LEFT)
    : replacer.repeat(indentSize);
};

const stringify = (node, depth) => {
  if (!_.isPlainObject(node)) {
    return `${node}`;
  }

  const closeBracketIndent = makeIndent(depth);

  const lines = Object
    .entries(node)
    .map(([key, value]) => {
      const indent = makeIndent(depth + 1);

      return `${indent}${key}: ${stringify(value, depth + 1)}`;
    });

  return ['{', ...lines, `${closeBracketIndent}}`].join('\n');
};

const getStringStylishFormat = (tree) => {
  const iter = (node, depth = 0) => {
    const closeBracketIndent = makeIndent(depth);

    const lines = node.map(({
      key, value1, value2, nodeValue, children, type,
    }) => {
      const indentWithOffset = makeIndent(depth + 1, true);
      const indent = makeIndent(depth + 1);

      switch (type) {
        case 'removed':
          return `${indentWithOffset}- ${key}: ${stringify(nodeValue, depth + 1)}`;
        case 'added':
          return `${indentWithOffset}+ ${key}: ${stringify(nodeValue, depth + 1)}`;
        case 'updated': {
          const removedData = `${indentWithOffset}- ${key}: ${stringify(value1, depth + 1)}`;
          const addedData = `${indentWithOffset}+ ${key}: ${stringify(value2, depth + 1)}`;
          return `${removedData}\n${addedData}`;
        }
        case 'nested':
          return `${indent}${key}: ${iter(children, depth + 1)}`;
        default:
          return `${indent}${key}: ${stringify(nodeValue, depth + 1)}`;
      }
    });

    return ['{', ...lines, `${closeBracketIndent}}`].join('\n');
  };

  return iter(tree);
};

export default getStringStylishFormat;
