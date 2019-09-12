'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.parametrosGobiernoRequest
 * @description
 * # parametrosgobiernoService
 * Service in the contractualClienteApp.
 */
angular.module('parametrosGobiernoService', [])
    .service('parametrosGobiernoRequest', function ($http, $q, token_service, CONF) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var path = CONF.GENERAL.PARAMETROS_GOBIERNO_SERVICE;
        // Public API here
        var cancelSearch; //defer object
        return {
            get: function (tabla, params) {
                cancelSearch = $q.defer();
                if (params === undefined) {
                    return $http.get(path + tabla, [{timeout: cancelSearch.promise }, token_service.setting_bearer.headers]);
                } else {
                    return $http.get(path + tabla + "/?" + params, [{timeout: cancelSearch.promise }, token_service.setting_bearer.headers]);
                }
            },
            post: function (tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
            },
            put: function (tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
            },
            delete: function (tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
            },
            cancel: function () {
                return cancelSearch.resolve('search aborted');
            }
        };
    });
