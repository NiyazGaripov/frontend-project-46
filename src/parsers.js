import { load } from 'js-yaml';

const dataTypeToParser = {
  yaml: load,
  json: JSON.parse,
};

const parse = (data, dataType) => dataTypeToParser[dataType](data);

export default parse;
