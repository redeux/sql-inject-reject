module.exports = (options) => {

  let {
    level,
    keywords,
    checkHeaders,
  } = options;


  // Validate the the options are in the correct format
  if (level != 'typical' && level != 'elevated' && level != 'paranoid' && level != 'silent' && typeof level !== 'undefined') {
    throw new Error('Invalid security level: Must be typical, elevated, paranoid, or silent');
  }

  if (!Array.isArray(keywords) && typeof keywords !== 'undefined') {
    throw new Error('Invalid keyword format: Must be formatted as an array');
  }

  if (typeof checkHeaders !== 'boolean' && typeof checkHeaders !== 'undefined') {
    throw new Error('Invalid checkHeaders value: Must be a boolean');
  }

  // If some options are supplied but not other the default values aren't registered so assign them
  if (!level) level = 'typical';
  if (!keywords) keywords = [];
  if (!checkHeaders) checkHeaders = false;

  return {
    level,
    keywords,
    checkHeaders,
  };
};