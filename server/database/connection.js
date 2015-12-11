//sets up database connection
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://localhost:5432/graspdb',
  searchPath: 'knex,public'
});

module.exports = pg;
