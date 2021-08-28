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
        var path = CONF.GENERAL.PLAN_ADQUISICIONES_CRUD_SERVICE;
        // Public API here
        var cancelSearch; //defer object
        return { 
            get: function (query) { 
                return $http.get(path + 'Registro_inversion_actividad-Fuente_financiamiento' + query);
            },
        };
    });
