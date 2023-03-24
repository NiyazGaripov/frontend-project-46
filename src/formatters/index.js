import getStringStylishFormat from './stylish.js';
import getStringPlainFormat from './plain.js';

const getDataInSpecifiedFormat = (data, format) => {
  switch (format) {
    case 'plain':
      return getStringPlainFormat(data);
    case 'json':
      return JSON.stringify(data);
    case 'stylish':
      return getStringStylishFormat(data);
    default:
      throw new Error(`Please add output format: '${format}' is unknown format type!`);
  }
};

export default getDataInSpecifiedFormat;
