import _ from 'lodash';

const buildAST = (data1, data2) => _.sortBy(_.union(Object.keys(data1), Object.keys(data2)))
  .map((key) => {
    const valueFromFirstFile = data1[key];
    const valueFromSecondFile = data2[key];

    if (!_.has(data2, key)) {
      return { key, newValue: valueFromFirstFile, type: 'removed' };
    }

    if (!_.has(data1, key)) {
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

export default buildAST;
