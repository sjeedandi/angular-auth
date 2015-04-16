'use strict';

angular.module('ngAuth')
  .controller('MainCtrl', function ($scope, $ngAuth) {
    console.log('$ngAuth', $ngAuth);

    $ngAuth.isAuthenticated()
      .then(function (success) {
        console.log('$ngAuth:isAuthenticated', success);
        $scope.ngAuth = success;
      })
      .catch(function (error) {
        console.log('$ngAuth:isAuthenticated', error);
        $scope.ngAuth = error;
      });
  });
