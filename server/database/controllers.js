var db = require('./connection.js'); //set up database connection
//this is responsible for communicating with the database
var jwt = require('jwt-simple');

module.exports = {
  users: {
     signin: function (request, callback) {
      db('users')
      .whereRaw('LOWER(username) LIKE ?', '%'+request.body.username.toLowerCase()+'%').
      andWhere({
        hashedpw: db.raw( "crypt('" + request.body.password + "', hashedpw)")
      })
      .select()
      .then(function (res) {
        var user = res[0].username;
        var token = jwt.encode(user, 'secret');
        res[0].token = token;
        callback(null, res);
      })
      .catch(function (error){
      callback(error, null);
    });
      },
      signup: function (request, callback) {
          db('users').insert( {username: request.body.username,
          firstname: request.body.firstname,
          secondname: request.body.secondname,
          email: request.body.email,
          hashedpw: db.raw( "crypt('"+ request.body.password + "', gen_salt('md5'))" )})
        //   .then(function(ret){
        // })
          .then(function (res) {
            var user = request.body.username;
            var token = jwt.encode(user, 'secret');
            res.token = token;
            callback(null, res);
          })
          .catch(function(error) {
            callback(error, null);
          });
        },
      checkAuth: function (request, callback) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
        var token = request.headers['x-access-token'];
        if (!token) {
          console.log("in error");
          var err = new Error("failed");
          callback(err, null);
        } else {
          var user = jwt.decode(token, 'secret');
          db('users').where('username', user)
          .then(function (res) {
            console.log("success"); 
            callback(null, res)
          })
          .catch(function (res) {
            callback(res, null)
          })
          }
      }
    }
  }
        
