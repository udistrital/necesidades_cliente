'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.metasService
 * @description
 * # metasService
 * Service in the contractualClienteApp.
 */
angular.module('metasService', [])
    .service('metasRequest', function ($http, $q, token_service, CONF) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        //var path = CONF.GENERAL.METAS_SERVICE;
        var path = CONF.GENERAL.PLAN_ADQUISISIONES_CRUD_SERVICE;
        // Public API here
        var cancelSearch; //defer object
        return { 
            get: function (query) { 
                // FIXME: ?query=Activo:true,Rubro:3-00-991-00
                console.log("PATH REQ", path + 'Registro_inversion_actividad-Fuente_financiamiento' + query);
                return $http.get(path + 'Registro_inversion_actividad-Fuente_financiamiento' + query);
            },
            getActividad: function (query) {
                
            }
            /*get: function (tabla, params) {
                cancelSearch = $q.defer();
                if (params === undefined) {
                    return $http.get(path + tabla, [{ timeout: cancelSearch.promise }, token_service.setting_bearer.headers]);
                } else {
                    return $http.get(path + tabla + "/?" + params, [{ timeout: cancelSearch.promise }, token_service.setting_bearer.headers]);
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
            }*/
        };
    });
