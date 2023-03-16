import getStringStylishFormat from './stylish.js';
import getStringPlainFormat from './plain.js';

const getDataInSpecifiedFormat = (data, format) => {
  if (format === 'plain') {
    return getStringPlainFormat(data);
  }
  return getStringStylishFormat(data);
};

export default getDataInSpecifiedFormat;
