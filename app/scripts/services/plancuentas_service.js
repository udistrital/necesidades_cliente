'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.planCuentasService
 * @description
 * # planCuentasService
 * Service in the contractualClienteApp.
 */
angular.module('planCuentasService',[])
  .service('planCuentasRequest', function ($http, $q, token_service, CONF) {
    // Service logic
    // ...
    var path = "http://127.0.0.1:8082/v1/";
    //var path = CONF.GENERAL.PLAN_CUENTAS_SERVICE;
    // Public API here
    var cancelSearch; //defer object
    return {
        get: function(tabla, params) {
            cancelSearch = $q.defer();
            return $http.get(path + tabla + "/?" + params, [{ timeout: cancelSearch.promise }, token_service.setting_bearer.headers]);
        },
        post: function(tabla, elemento) {
            return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
        },
        put: function(tabla, id, elemento) {
            return $http.put(path + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
        },
        delete: function(tabla, id) {
            return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
        },
        cancel: function() {
            return cancelSearch.resolve('search aborted');
        }
    };
  });
