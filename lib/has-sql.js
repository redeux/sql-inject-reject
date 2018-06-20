/*!
 * sql-inject-reject
 * Copyright(c) 2018 Phil Sautter
 * MIT Licensed
 */

// sql regex reference: http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks

const xregexp = require('xregexp');

const paranoid = xregexp('(%27)|(\')|(--)|(%23)|(#)', 'i');
const elevated = xregexp('((%3D)|(=))[^\\n]*((%27)|(\')|(--)|(%3B)|(;))', 'ix');
const typical = xregexp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'ix');

/**
 * Determines if a the value provided matches common SQL injection attacks
 * @param  {string} value - The data that will be checked for SQL injections.
 * @param  {string} securityLevel - The security level used to check for SQL injections.
 * @param  {array<function>} keywords - Regex statements of hex encoded keywords.
 * @return {Promise<boolean>} - Resolves true if a potential SQL statement is found or false if not.
 */
module.exports = (value, securityLevel, keywords) => {
  return new Promise((resolve) => {
    if (value) {
      if (securityLevel == 'paranoid') {
        if (paranoid.test(value)) return resolve(true);
      }
      if (securityLevel == 'elevated' || securityLevel == 'paranoid') {
        if (elevated.test(value)) return resolve(true);
      }
      if (securityLevel == 'typical' || securityLevel == 'elevated' || securityLevel == 'paranoid') {
        if (typical.test(value)) return resolve(true);
      }
      if (keywords) {
        if (Array.isArray(keywords) && keywords.length > 0) {
          for (let i = 0; i < keywords.length; i++) {
            if (keywords[i].test(value)) return resolve(true);
          }
        }
      }
    }
    return resolve(false);
  });
};
