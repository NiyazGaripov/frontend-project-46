import getStringStylishFormat from './stylish.js';
import getStringPlainFormat from './plain.js';

const getDataInSpecifiedFormat = (data, format) => {
  switch (format) {
    case 'plain':
      return getStringPlainFormat(data);
    case 'json':
      return JSON.stringify(data);
    default:
      return getStringStylishFormat(data);
  }
};

export default getDataInSpecifiedFormat;
