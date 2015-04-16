(function () {
  'use strict';

  angular.module('ngAuth', [])


  .config(function ($ngAuthProvider) {
    $ngAuthProvider.set({
      baseUrl: '/authentication'
    });
  })


  /**
   * @provider $ngAuth
   */
  .provider('$ngAuth', function () {

    var options = {};

    // Create empty object to store the uidObject
    options.uid = {};

    // Default methods for validation of the uidObject
    options.validation = {
      fn: {
        email: function (value) {
          return angular.isString(value);
        },
        password: function (value) {
          return angular.isString(value) && value.length > 6;
        },
        token: function (value) {
          return angular.isString(value);
        },
        expires: function (value) {
          return angular.isDate(value) || value > Date.now();
        }
      },
      requirements: {
        credentials: ['email', 'password'],
        uid: ['email', 'password', 'token', 'expires']
      }
    };

    return {

      set: function (value) {
        angular.extend(options, value);
      },

      $get: ['ngAuthFactory', function (ngAuthFactory) {
        return ngAuthFactory(options);
      }]

    };
  })


  /**
   * @factory ngAuthFactory
   */
  .factory('ngAuthFactory', function ($q, $http, $rootScope, $timeout) {
    return function (options) {


      var self = {};
      var isAuthenticated = false;


      /**
       * [validate description]
       * @param  {[type]} uid          [description]
       * @param  {[type]} requirements [description]
       * @return {[type]}              [description]
       */
      var validate = function (uid, requirements) {

        var valid = true;

        angular.forEach(requirements, function (key) {
          if (angular.isUndefined(uid[key]) || options.validation.fn[key](uid[key]) === false) {
            valid = false;
          }
        });

        return valid;
      };


      /**
       * @method sendAuthenticationRequest Post credentials to API backend
       * @param  {Object} uid The credentials
       * @param  {Promise} dfr Deferred promise
       * @return {$http}
       */
      var sendAuthenticationRequest = function (uid, dfr) {
        return $http.post(options.baseUrl, uid)
          .success(function (data, status, headers, config) {
            dfr.resolve(data);
          })
          .error(function (data, status, headers, config) {
            dfr.reject(data);
          });
      };


      self.set = function (value) {
        self.uid = value;
      };


      /**
       * [authenticate description]
       * @param  {[type]} uid [description]
       * @return {[type]}     [description]
       */
      self.authenticate = function (uid) {

        var dfr = $q.defer();

        // Reject promise when no uid is provided, otherwise
        // call send the authentication request;s
        if (angular.isUndefined(uid) || validate(uid, options.validation.requirements.credentials) === false) {
          $timeout(function () {
            dfr.reject(false);
          }, 0);
        } else {
          sendAuthenticationRequest(uid, dfr);
        }

        return dfr.promise;

      };


      /**
       * [deauthenticate description]
       * @return {[type]} [description]
       */
      self.deauthenticate = function () {
        var dfr = $q.defer();

        return dfr.promise;
      };


      /**
       * @method isAuthenticated 
       * @return {Promise}
       */
      self.isAuthenticated = function () {

        var dfr = $q.defer();

        // When the user is already authenticated we resolve 
        // the deferred promise. We use a $timeout for this.
        if (validate(self.uid, options.validation.requirements.uid)) {
          $timeout(function () {
            dfr.resolve(isAuthenticated);
          }, 0);
        }

        // When the valid credentials are found on the client
        // we try to authenticate the user automatically. When no valid
        // credentials are available we will reject the promise.
        if (validate(self.uid, options.validation.requirements.credentials)) {
          self.authenticate(self.uid).then(function (uid) {
            dfr.resolve(uid);
          }, function (error) {
            dfr.reject(error);
          });
        } else {
          dfr.reject(false);
        }

        return dfr.promise;

      };

      // Extend object with options
      angular.extend(self, options);

      return self;

    };
  });

})();
