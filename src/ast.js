import _ from 'lodash';

const buildAST = (dataOfFirstFile, dataOfSecondFile) => {
  const keys = Object.keys({ ...dataOfFirstFile, ...dataOfSecondFile });
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => {
    const valueFromFirstFile = dataOfFirstFile[key];
    const valueFromSecondFile = dataOfSecondFile[key];
    const hasPropertyInFirstFile = Object.hasOwn(dataOfFirstFile, key);
    const hasPropertyInSecondFile = Object.hasOwn(dataOfSecondFile, key);

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
