;
(function(ng) {
  "use strict";

  ng
    .module("n4AuthenticationInterceptor", [])
    .config(["$httpProvider", function($httpProvider) {
      $httpProvider.interceptors.unshift("n4AuthenticationInterceptor");
    }])
    .provider("n4AuthenticationInterceptor", [
      function() {
        var self = this;

        self.cb = angular.noop; //callback to be executed before the redirect
        self.redirectURL = undefined;
        self.notAuthenticatedMessage = "Usuário não autenticado.";
        self.statusHttp = 401;

        self.$get = ["$q", "$window", "$log", function($q, $window, $log) {
          return {
            responseError: function(rejection) {
              if (rejection.status === self.statusHttp) {
                self.cb();
                $log.error(self.notAuthenticatedMessage);
                if (!!self.redirectURL) {
                    $window.location.replace(self.redirectURL);
                }
              }

              return $q.reject(rejection);
            }
          };
        }];
      }
    ]);

}(angular));
