//sets up database connection

if (process.env.database === undefined) {
  var dbstuff = require('../../dbstuff.js')
}
var pg = require('knex')({
  client:'pg',
  connection: {
    host : process.env.host || dbstuff.host,
    user :  process.env.dbuser || dbstuff.user,
    password : process.env.password || dbstuff.password,
    database : process.env.database || dbstuff.database,
    port: process.env.port || dbstuff.port
  },
  searchPath: 'knex,public'
});

module.exports = pg;
