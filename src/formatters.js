import _ from "lodash";

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

export default formatting;
