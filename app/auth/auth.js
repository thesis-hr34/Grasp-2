angular.module('Grasp.Auth', ['ngRoute'])
.controller('AuthCTRL', function ($scope, Auth, $location, $window, $rootScope) {
  $scope.loginUser = {};
  $scope.signUpUser = {};

  $scope.loggedIn = function () {
    Auth.loggedIn();
  };

  $scope.signin = function () {
    Auth.signin($scope.loginUser)
    .then(function (token) {
         $window.localStorage.setItem('com.grasp', token);
        // console.log("This is the token", token);
        $location.path('/canvas');
      })
      .catch(function (error) {
        console.error(error);
        $location.path('/auth');
      });
    };

  $scope.signup = function () {
    Auth.signup($scope.signUpUser)
    .then(function (res) {
    var token = res.data.token;
        $window.localStorage.setItem('com.grasp', token);
        $location.path('/canvas');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.isAuth = function () {
    Auth.isAuth();
  };

  $scope.signout = function () {
    Auth.signout();
   };


})
.factory('Auth', function ($http, $location, $window, $rootScope){
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function (resp) {
      console.log("resp", resp.data[0].token);
      return resp.data[0].token;
      console.log("woooo");
    });
  };

  var signup = function (user) {
    console.log(user);
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function (resp) {
      console.log("resp",resp)
      return resp;
    });
  };

  var isAuth = function () {
      return $http({
      method: 'GET',
      url: '/api/signedin'
    })
    .then(function (resp) {
      console.log("resp", resp)
      console.log("woooo");
    })
    .catch(function (error) {
      $location.path('/auth')
    })
    // return !!$window.localStorage.getItem('com.grasp');
  };
    var signout = function () {
      $window.localStorage.removeItem('com.grasp');
      // var attach = {
      //   request: function (object) {
      //       console.log("object...",object);
      //       return object;
      //     }
      //   }
      $location.path('/auth');
      // return attach;
    };

    var loggedIn = function () {
    $rootScope.$on('$routeChangeStart', function (evt, next, current) {
      console.log(next.$$route.templateUrl)
        if(next.$$route.templateUrl === "auth/auth.html") {
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
})