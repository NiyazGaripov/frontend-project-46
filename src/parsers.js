import yaml from 'js-yaml';

const EXTENSION = {
  JSON: '.json',
  YML: '.yml',
  YAML: '.yaml',
};
const parse = (data, extension = EXTENSION.JSON) => {
  let parseMethod;

  if (extension === EXTENSION.JSON) {
    parseMethod = JSON.parse;
  } else if (extension === EXTENSION.YML || extension === EXTENSION.YAML) {
    parseMethod = yaml.load;
  }

  return parseMethod(data);
};

export default parse;
