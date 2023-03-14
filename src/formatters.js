import _ from 'lodash';

const stringify = (node, depth) => {
  if (!_.isObject(node)) {
    return `${node}`;
  }

  const indentSize = depth * 2;
  const currentIndent = ' '.repeat(indentSize + 2);
  const bracketIndent = ' '.repeat(indentSize - 2);
  const lines = Object
    .entries(node)
    .map(([key, value]) => `${currentIndent}${key}: ${stringify(value, depth + 2)}`);

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const formatting = (tree) => {
  const iter = (node, depth) => {
    if (!_.isObject(node)) {
      return `${node}`;
    }

    const indentSize = depth * 2;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - 2);

    if (!_.isArray(node)) {
      return stringify(node, depth);
    }

    const lines = node.map(({ key, value, state }) => {
      if (String(value).length) {
        return `${currentIndent}${state} ${key}: ${iter(value, depth + 2)}`;
      }

      return `${currentIndent}${state} ${key}:`;
    });

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(tree, 1);
};

export default formatting;
