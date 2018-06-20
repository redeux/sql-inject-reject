/*!
 * sql-inject-reject
 * Copyright(c) 2018 Phil Sautter
 * MIT Licensed
 */

const hexValueOf = require('./hex-values');
const xregexp = require('xregexp');

module.exports = (keywords) => {
  if (Array.isArray(keywords) && keywords.length > 0) {
    const keywordsLength = keywords.length;
    const isOnlyLetters = new RegExp('^[a-zA-Z]+$');

    // Make sure the keywords are strings and crash if any aren't
    for (let i = 0; i < keywordsLength; i++) {
      if (!isOnlyLetters.test(keywords[i])) throw new Error(`Invalid keyword: ${keywords[i]}`);
    }

    /*
    * Take the keywords and format them for sql injections
    * Format is w*((%27)|('))((%lowerCaseHex)|letter|(%upperCaseHex))...
    * Returns an array of properly formatted regex functions
    */
    return keywords.map((word) => {
      const splitKeyword = word.toLowerCase().split('');
      const splitKeywordLength = splitKeyword.length;
      let encondedWord = 'w*((%27)|(\'))';
      for (let j = 0; j < splitKeywordLength; j++) {
        encondedWord += '((%' + hexValueOf[splitKeyword[j]] + ')|' + splitKeyword[j] + '|' + '(%' + hexValueOf[splitKeyword[j].toUpperCase()] + '))';
      }
      return xregexp(encondedWord, 'ix');
    });
  }
  return [];
};
