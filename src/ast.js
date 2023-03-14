import _ from 'lodash';

const makeNode = (key, value, state) => ({
  key,
  value,
  state,
});

const buildAST = (dataOfFirstFile, dataOfSecondFile) => {
  const keys = Object.keys({ ...dataOfFirstFile, ...dataOfSecondFile });
  const sortedKeys = _.sortBy(keys);
  const tree = [];

  sortedKeys.forEach((key) => {
    const valueFromFirstFile = dataOfFirstFile[key];
    const valueFromSecondFile = dataOfSecondFile[key];
    const hasPropertyInFirstFile = Object.hasOwn(dataOfFirstFile, key);
    const hasPropertyInSecondFile = Object.hasOwn(dataOfSecondFile, key);

    if (hasPropertyInFirstFile && !hasPropertyInSecondFile) {
      const node = makeNode(key, valueFromFirstFile, '-');
      tree.push(node);
    } else if (!hasPropertyInFirstFile && hasPropertyInSecondFile) {
      const node = makeNode(key, valueFromSecondFile, '+');
      tree.push(node);
    } else if (
      (!_.isObject(valueFromFirstFile) || !_.isObject(valueFromSecondFile))
      && valueFromFirstFile !== valueFromSecondFile) {
      const nodeFromFirstFile = makeNode(key, valueFromFirstFile, '-');
      const nodeFromSecondFile = makeNode(key, valueFromSecondFile, '+');
      tree.push(nodeFromFirstFile);
      tree.push(nodeFromSecondFile);
    } else if (valueFromFirstFile === valueFromSecondFile) {
      const node = makeNode(key, valueFromFirstFile, ' ');
      tree.push(node);
    } else if (_.isObject(valueFromFirstFile) && _.isObject(valueFromSecondFile)) {
      const children = buildAST(valueFromFirstFile, valueFromSecondFile);

      const node = makeNode(key, children, ' ');

      tree.push(node);
    }
  });

  return tree;
};

export default buildAST;
