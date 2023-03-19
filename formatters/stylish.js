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
    if (!_.isObject(node)) {
      return `${node}`;
    }

    const indentSize = depth * DEFAULT_INDENT;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - DEFAULT_INDENT);

    if (!_.isArray(node)) {
      return stringify(node, depth);
    }

    const lines = node.map(({ nodeKey, nodeValue, nodeState }) => {
      if (String(nodeValue).length) {
        return `${currentIndent}${nodeState} ${nodeKey}: ${iter(nodeValue, depth + DEFAULT_INDENT)}`;
      }

      return `${currentIndent}${nodeState} ${nodeKey}:`;
    });

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(tree, 1);
};

export default getStringStylishFormat;
