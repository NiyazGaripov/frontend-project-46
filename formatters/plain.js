import _ from 'lodash';

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
