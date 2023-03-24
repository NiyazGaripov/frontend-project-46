import _ from 'lodash';

const buildAST = (data1, data2) => _.sortBy(_.union(Object.keys(data1), Object.keys(data2)))
  .map((key) => {
    const valueFromData1 = data1[key];
    const valueFromData2 = data2[key];

    if (!_.has(data2, key)) {
      return { key, newValue: valueFromData1, type: 'removed' };
    }

    if (!_.has(data1, key)) {
      return { key, newValue: valueFromData2, type: 'added' };
    }

    if (_.isPlainObject(valueFromData1) && _.isPlainObject(valueFromData2)) {
      const children = buildAST(valueFromData1, valueFromData2);
      return { key, children, type: 'nested' };
    }

    if (!_.isEqual(valueFromData1, valueFromData2)) {
      return {
        key, oldValue: valueFromData1, newValue: valueFromData2, type: 'updated',
      };
    }

    return { key, newValue: valueFromData1, type: 'unchanged' };
  });

export default buildAST;
