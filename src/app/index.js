(function () {
  'use strict';

  angular.module('ngAuth', [])
    
    /**
     * @provider $ngAuth
     */
    .provider('$ngAuth', function () {
      
      var options = {};
      options.uid = null;
      
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
    .factory('ngAuthFactory', function ($q, $rootScope, $timeout) {
      return function (options) {
        
        var tempUid = {
          username: 'Piet',
          password: 'fsghfsjf45tyu',
          token: '/1435674uihdjf-567d',
          expires: new Date().setHours(18)
        };
        
        var self = {}
        var isAuthenticated = false;
        

        var hasValidUid = function () {
          return true;
        };


        self.set = function (value) {
          self.uid = value;
        };


        self.authenticate = function () {
          var dfr = $q.defer();
          $timeout(function () {
            dfr.resolve(tempUid);
            // dfr.reject(false);
          }, 2000);
          return dfr.promise;
        };


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
          if (isAuthenticated === true) {
            
            $timeout(function () {
              dfr.resolve(isAuthenticated);
            }, 0);
          
          } else {

            if (hasValidUid(self.uid)) {
              
              // When the valid credentials are found on the client
              // we try to authenticate the user automatically.
              self.authenticate(self.uid).then(function (uid) {
                dfr.resolve(uid);
              }, function (error) {
                dfr.reject(error);
              });

            } else {

              // Invalid credentials
              dfr.reject();

            }

          }

          return dfr.promise;

        };

        // Extend object with options
        angular.extend(self, options);

        return self;

      };
    });

})();