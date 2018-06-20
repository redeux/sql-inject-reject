/*!
 * sql-inject-reject
 * Copyright(c) 2018 Phil Sautter
 * MIT Licensed
 */

const rawBody = require('raw-body');
const hasSql = require('./has-sql');
const formatKeywords = require('./helpers/format-keywords');
const rejectRequest = require('./reject-request');
const validateOptionValues = require('./helpers/validate-options');

module.exports = (options = {
  level: 'typical',
  keywords: [],
  checkHeaders: false,
}) => {
  /*
   * This code only runs when we initialize the server
   * It runs syncronously so that we don't accept requests before the keywords are ready
   */

  const optionValues = validateOptionValues(options);

  const {
    level,
    keywords,
    checkHeaders,
  } = optionValues;

  const formattedKeywords = formatKeywords(keywords);

  /*
   * This is the code that's called when our middleware is activated
   * It runs asyncronously to minimize performance impact on the server
   */
  return async (req, res, next) => {
    // Check the URL and parameters for SQL
    if (req.originalUrl) {
      if (await hasSql(req.originalUrl, level, formattedKeywords)) return rejectRequest(res);
    }

    // Check the headers for SQL if the checkHeaders option is truthy
    // if (checkHeaders) {
    //   if (await hasSql(req.headers, level, formattedKeywords)) return rejectRequest(res);
    // }

    /*
     * Extract the body from the request and convert it to UTF8
     * If we can't extract and convert the body we bypass the SQL check
     */
    const body = await rawBody(req, {
      encoding: 'utf8',
    }).catch(err => next(err));

    if (await hasSql(body, level, formattedKeywords)) return rejectRequest(res);

    return next();
  };
};
