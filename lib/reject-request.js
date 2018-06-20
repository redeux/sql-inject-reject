/*!
 * sql-inject-reject
 * Copyright(c) 2018 Phil Sautter
 * MIT Licensed
 */

module.exports = res => res.status(403).json({
  error: 'SQL Detected, Request Rejected.',
});
