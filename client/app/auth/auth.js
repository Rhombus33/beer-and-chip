angular.module('auth', ['ngCookies'])
.controller('AuthController', function($scope, $window, $location, $cookies, AuthFactory) {
  $scope.user = {};

  $scope.logout = function() {
    AuthFactory.signout();
  }
})
.factory('AuthFactory', function($http, $window, $location, $cookies) {
  var isAuth = function () {
    return !!$cookies.get('displayName');
  };

  var signout = function () {
    var cookies = $cookies.getAll();
    angular.forEach(cookies, function (v, k) {
        $cookies.remove(k);
    });
    $location.path('/signin');
  };

  return {
    isAuth: isAuth,
    signout: signout
  };
});
