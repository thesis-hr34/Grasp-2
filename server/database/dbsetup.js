var db = require('./connection.js');

db.schema.hasTable('lessons').then(function (exists) {
  if(!exists) {
      return db.schema.createTable('lessons', function (table) {
      table.increments('id').primary();
      table.string('name', 100);
    });
    } else {
        console.log("lessons exist!");
      }
  });

db.schema.hasTable('users').then(function(exists) {
  if(!exists) {
    return db.schema.createTable('users', function (table) {
      table.increments('id').primary(); 
      table.string('username', 100).unique();
      table.string('firstname', 100);
      table.string('secondname', 100);
      table.string('hashedpw', 100);
      table.string('email', 100).unique();
      table.date('age');
      table.integer('lessonsCompleted').references('id').inTable('lessons');
      table.integer('lessonsInprogress').references('id').inTable('lessons');
    });
  } else {
    console.log("users exist!");
  }
});