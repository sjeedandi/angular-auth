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
        $scope.authenticate = function (credentials) {
          $ngAuth.authenticate(credentials).then(function (uid) {
            console.log('$ngAuth:authenticate()',credentials, uid);
          }, function (error) {

          });
        };
      });
  });
