'use strict';

/**
 * @ngdoc service
 * @name necesidadesCrudService.necesidadesCrudRequest
 * @description
 * # necesidadesCrudRequest
 * Factory in the necesidadesCrudService.
 */
angular.module('necesidadesCrudService', [])
    .factory('necesidadesCrudRequest', function($http, CONF, token_service) {
        // Service logic
        // ...
        var path = CONF.GENERAL.NECESIDADES_CRUD_SERVICE;
        var interceptor = CONF.GENERAL.PLAN_CUENTAS_MID_SERVICE;

        // Public API here
        return {
            get: function(tabla, params) {
                if(angular.isUndefined(params)){
                    return $http.get(path + tabla, token_service.setting_bearer.headers);
                }else{
                    return $http.get(path + tabla + "/?" + params, token_service.setting_bearer.headers);
                }
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
            },
            put: function(tabla, id, elemento) {
                return $http.put(interceptor + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
            }
        };
    });
