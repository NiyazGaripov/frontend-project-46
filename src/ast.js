import _ from 'lodash';

const getSortedKeys = (data1, data2) => {
  const unionKeys = _.union(Object.keys(data1), Object.keys(data2));

  return _.sortBy(unionKeys);
};

const buildAST = (data1, data2) => {
  const sortedKeys = getSortedKeys(data1, data2);

  return sortedKeys.map((key) => {
    const valueFromData1 = data1[key];
    const valueFromData2 = data2[key];

    if (!_.has(data2, key)) {
      return { key, nodeValue: valueFromData1, type: 'removed' };
    }

    if (!_.has(data1, key)) {
      return { key, nodeValue: valueFromData2, type: 'added' };
    }

    if (_.isPlainObject(valueFromData1) && _.isPlainObject(valueFromData2)) {
      const children = buildAST(valueFromData1, valueFromData2);
      return { key, children, type: 'nested' };
    }

    if (!_.isEqual(valueFromData1, valueFromData2)) {
      return {
        key, value1: valueFromData1, value2: valueFromData2, type: 'updated',
      };
    }

    return { key, nodeValue: valueFromData1, type: 'unchanged' };
  });
};

export default buildAST;
