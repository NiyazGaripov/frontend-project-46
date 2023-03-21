import _ from 'lodash';

const getTextWithRemovedProperty = (property) => `Property '${property}' was removed`;
const getTextWithAddedProperty = (property, value) => `Property '${property}' was added with value: ${value}`;
const getTextWithUpdatedProperty = (property, oldValue, newValue) => `Property '${property}' was updated. From ${oldValue} to ${newValue}`;
const createPropertyPath = (path, key) => (path === '' ? key : `${path}.${key}`);

const transformValue = (nodeValue) => {
  if (_.isString(nodeValue)) {
    return `'${nodeValue}'`;
  }

  if (_.isObject(nodeValue)) {
    return '[complex value]';
  }

  return nodeValue;
};

const getStringPlainFormat = (tree) => {
  const iter = (ast, path = '') => ast.flatMap(({ key, oldValue, newValue, children, type }) => {
    const propertyPath = createPropertyPath(path, key);

    switch (type) {
      case 'removed':
        return getTextWithRemovedProperty(propertyPath);
      case 'added':
        return getTextWithAddedProperty(propertyPath, transformValue(newValue));
      case 'updated':
        return getTextWithUpdatedProperty(propertyPath, transformValue(oldValue), transformValue(newValue));
      case 'nested':
        return iter(children, `${propertyPath}`);
      default:
        return null;
    }
  }).filter((node) => node !== null).join('\n');

  return iter(tree);
};

export default getStringPlainFormat;
