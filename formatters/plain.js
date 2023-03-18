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

const getUpdatedStructure = (path, nodes) => {
  if (!_.isObject(nodes)) {
    return '';
  }

  return nodes.flatMap((node) => {
    const { nodeKey, nodeValue, nodeState } = node;
    const property = `${path}.${nodeKey}`;

    switch (nodeState) {
      case '-':
        return getTextWithRemovedProperty(property);
      case '+':
        return getTextWithAddedProperty(property, transformValue(nodeValue));
      case ' ':
        return getUpdatedStructure(property, nodeValue);
      default:
        if (Array.isArray(node)) {
          const [{ nodeValue: oldValue }, { nodeKey: newKey, nodeValue: newValue }] = node;
          return getTextWithUpdatedProperty(`${path}.${newKey}`, transformValue(oldValue), transformValue(newValue));
        }
        return node;
    }
  });
};

const getStringPlainFormat = (tree) => {
  const iter = (node, path = '') => node.reduce((lines, { nodeKey, nodeValue, nodeState }) => {
    const propertyPath = createPropertyPath(path, nodeKey);

    if (Array.isArray(nodeValue)) {
      return [...lines, ...getUpdatedStructure(propertyPath, nodeValue).filter((element) => element !== '')];
    }

    if (nodeState === '-') {
      return [...lines, getTextWithRemovedProperty(nodeKey)];
    }

    if (nodeState === '+') {
      return [...lines, getTextWithAddedProperty(nodeKey, transformValue(nodeValue))];
    }

    return [...lines, ...iter(nodeValue, `${propertyPath}.${nodeKey}`)];
  }, []);

  return iter(tree).filter((item) => item !== '').join('\n');
};

export default getStringPlainFormat;