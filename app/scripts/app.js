/*global moment */
'use strict';

/**
 * @ngdoc overview
 * @name contractualClienteApp
 * @description
 * # contractualClienteApp
 *
 * Main module of the application.
 */
angular
    .module('contractualClienteApp', [
        'angular-loading-bar',
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'afOAuth2',
        'treeControl',
        'ngMaterial',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.treeView',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.exporter',
        'ui.grid.autoResize',
        'ui.grid.exporter',
        'ui.grid.expandable',
        'ui.grid.pinning',
        'ngStorage',
        'ngWebSocket',
        'angularMoment',
        'ui.utils.masks',
        'pascalprecht.translate',
        'nvd3',
        'ui.knob',
        'file-model',
        'angularBootstrapFileinput',
        'financieraService',
        'planCuentasService',
        'metasService',
        'coreService',
        'coreAmazonService',
        'administrativaService',
        'agoraService',
        'oikosService',
        'oikosAmazonService',
        'financieraMidService',
        'adminMidService',
        'amazonAdministrativaService',
        'academicaService',
        'contratoService',
        'gridOptionsService',
        'configuracionService',
        'requestService',
        'gridApiService',
        'colombiaHolidaysService',
        'nuxeoClient',
        'ngMaterial',
        'md-steppers',
        'implicitToken'
    ])
    .run(function (amMoment) {
        amMoment.changeLocale('es');
    })
    .factory('httpRequestInterceptor', function () {
        return {
            request: function (config) {

                if (window.localStorage.getItem('access_token') !== undefined && window.localStorage.getItem('access_token') !== null) {
                    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
                }
                config.headers.Accept = 'application/json';

                return config;
            }
        };
    })
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-div"><div><span class="fa loading-spinner"></div><div class="fa sub-loading-div">Por favor espere, cargando...</div></div>';
    }])
    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment.utc(date).format('YYYY-MM-DD') : '';
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    })
    .config(['$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider, $routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $locationProvider.hashPrefix("");
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/notificaciones', {
                templateUrl: 'views/notificaciones.html',
                controller: 'NotificacionesCtrl',
                controllerAs: 'notificaciones'

            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/necesidad/solicitud_necesidad', {
                templateUrl: 'views/necesidad/solicitud_necesidad.html',
                controller: 'SolicitudNecesidadCtrl',
                controllerAs: 'solicitudNecesidad'
            })
            .when('/necesidad/solicitud_necesidad/:IdNecesidad?', {
                templateUrl: 'views/necesidad/solicitud_necesidad.html',
                controller: 'SolicitudNecesidadCtrl',
                controllerAs: 'solicitudNecesidad'
            })
            .when('/necesidades', {
                templateUrl: 'views/necesidad/necesidades.html',
                controller: 'NecesidadesCtrl',
                controllerAs: 'necesidades'
            })
            .when('/necesidad/necesidad-pdf/:IdNecesidad?', {
                templateUrl: 'views/necesidad/pdfnecesidad.html',
                controller: 'PdfnecesidadCtrl',
                controllerAs: 'necesidadPdf'
            })
            .when('/necesidad/necesidad_reportes', {
                templateUrl: 'views/necesidad/necesidad_reportes.html',
                controller: 'NecesidadReportesCtrl',
                controllerAs: 'necesidadReportes'
            })
            .when('/necesidad/necesidad_externa', {
                templateUrl: 'views/necesidad/necesidad_externa.html',
                controller: 'NecesidadExternaCtrl',
                controllerAs: 'necesidadExterna'
            })
            .when('/necesidad/necesidad_contratacion_docente', {
                templateUrl: 'views/necesidad/necesidad_contratacion_docente.html',
                controller: 'NecesidadContratacionDocenteCtrl',
                controllerAs: 'necesidadContratacionDocente'
            })
            .when('/cdp/cdp_solicitud_consulta', {
                templateUrl: 'views/cdp/cdp_solicitud_consulta.html',
                controller: 'CdpCdpSolicitudConsultaCtrl',
                controllerAs: 'cdpSolicitudConsulta'
            })
            .when('/cdp/cdp_consulta', {
                templateUrl: 'views/cdp/cdp_consulta.html',
                controller: 'CdpCdpConsultaCtrl',
                controllerAs: 'cdpConsulta'
            })
            .when('/404', {
                templateUrl: '404.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
