import _ from 'lodash';

const buildAST = (data1, data2) => {
  const keys = Object.keys({ ...data1, ...data2 });
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => {
    const valueFromFirstFile = data1[key];
    const valueFromSecondFile = data2[key];
    const hasPropertyInFirstFile = Object.hasOwn(data1, key);
    const hasPropertyInSecondFile = Object.hasOwn(data2, key);

    if (!hasPropertyInSecondFile) {
      return { key, newValue: valueFromFirstFile, type: 'removed' };
    }

    if (!hasPropertyInFirstFile) {
      return { key, newValue: valueFromSecondFile, type: 'added' };
    }

    if (
      (!_.isObject(valueFromFirstFile) || !_.isObject(valueFromSecondFile))
      && valueFromFirstFile !== valueFromSecondFile) {
      return {
        key, oldValue: valueFromFirstFile, newValue: valueFromSecondFile, type: 'updated',
      };
    }

    if (_.isObject(valueFromFirstFile) && _.isObject(valueFromSecondFile)) {
      const children = buildAST(valueFromFirstFile, valueFromSecondFile);
      return { key, children, type: 'nested' };
    }

    return { key, newValue: valueFromFirstFile, type: 'unchanged' };
  });
};

export default buildAST;
