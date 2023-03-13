import { load } from 'js-yaml';

const EXTENSION = {
  JSON: '.json',
  YML: '.yml',
  YAML: '.yaml',
};
const parse = (data, extension = EXTENSION.JSON) => {
  if (extension === EXTENSION.YML || extension === EXTENSION.YAML) {
    return load(data);
  }
  return JSON.parse(data);
};

export default parse;
