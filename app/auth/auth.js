angular.module('Grasp.Auth', ['ngRoute'])
.controller('AuthCTRL', function ($scope, Auth, $location, $window, $rootScope) {
  "use strict";

  $scope.loginUser = {};
  $scope.signUpUser = {};

  $scope.loggedIn = function () {
    Auth.loggedIn();
  };

  $scope.signin = function () {
    Auth.signin($scope.loginUser)
    .then(function (token) {
      $window.localStorage.setItem('com.grasp', token);
      $window.localStorage.setItem('username', $scope.loginUser.username);
      $location.path('/canvas');
    })
    .catch(function (error) {
      console.error(error);
      $location.path('/signin');
    });
  };

  $scope.signup = function () {
    Auth.signup($scope.signUpUser)
    .then(function (res) {
      var token = res.data.token;
      $window.localStorage.setItem('com.grasp', token);
      $window.localStorage.setItem('username', $scope.signUpUser.username);
      $location.path('/canvas');
    })
    .catch(function (error) {
      console.error(error);
      $location.path('/signup');
    });
  };

  $scope.isAuth = function () {
    Auth.isAuth();
  };

  $scope.signout = function () {
    $window.localStorage.removeItem('username');
    Auth.signout();
  };
})
.factory('Auth', function ($http, $location, $window, $rootScope){
  "use strict";

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function (res) {
      return res.data[0].token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function (res) {
      console.log(res);
      return res;
    });
  };

  var isAuth = function () {
    return $http({
    method: 'GET',
    url: '/api/signedin'
    })
    .then(function (resp) {
      console.log('hi');
    })
    .catch(function (error) {
      $location.path('/signin');
    })
  };

  var signout = function () {
    $window.localStorage.clear();
    $location.path('/signin');
  };

  var loggedIn = function () {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
      if(next.$$route.templateUrl === "auth/signin.html") {
        if(!!$window.localStorage.getItem('com.grasp')) {
          $location.path('/canvas');
          }
        } else if(next.$$route.templateUrl === "auth/signup.html") {
          if(!!$window.localStorage.getItem('com.grasp')) {
            $location.path('/canvas');
          }
        }
      })
  }
  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    loggedIn: loggedIn
  };
})
.run(function ($rootScope, $location, Auth){
  Auth.loggedIn();
});
