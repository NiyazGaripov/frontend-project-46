import _ from 'lodash';

const getTextWithRemovedProperty = (property) => `Property '${property}' was removed`;
const getTextWithAddedProperty = (property, value) => `Property '${property}' was added with value: ${value}`;
const getTextWithUpdatedProperty = (property, value1, nodeValue) => `Property '${property}' was updated. From ${value1} to ${nodeValue}`;
const createPropertyPath = (path, key) => (path === '' ? key : `${path}.${key}`);

const transformValue = (nodeValue) => {
  if (_.isString(nodeValue)) {
    return `'${nodeValue}'`;
  }

  if (_.isPlainObject(nodeValue)) {
    return '[complex value]';
  }

  return nodeValue;
};

const getStringPlainFormat = (tree) => {
  const iter = (ast, path = '') => ast.flatMap(({
    key, value1, value2, nodeValue, children, type,
  }) => {
    const propertyPath = createPropertyPath(path, key);

    switch (type) {
      case 'removed':
        return getTextWithRemovedProperty(propertyPath);
      case 'added':
        return getTextWithAddedProperty(propertyPath, transformValue(nodeValue));
      case 'updated':
        return getTextWithUpdatedProperty(
          propertyPath,
          transformValue(value1),
          transformValue(value2),
        );
      case 'nested':
        return iter(children, `${propertyPath}`);
      default:
        return null;
    }
  }).filter((node) => node !== null).join('\n');

  return iter(tree);
};

export default getStringPlainFormat;
