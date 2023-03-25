import { load } from 'js-yaml';

const parsers = {
  '.yml': load,
  '.yaml': load,
  '.json': JSON.parse,
};

const parse = (data, dataType) => parsers[dataType](data);

export default parse;
