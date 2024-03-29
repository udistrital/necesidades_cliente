'use strict';
/**
 * @ngdoc function
 * @name core.controller:menuLateralCtrl
 * @description
 * # menuLateralCtrl
 * Controller of the core
 */
angular.module('core')
    .controller('menuLateralCtrl',
        function ($location, CONF, $window, $scope, $rootScope, token_service, configuracionRequest, notificacion, $translate, $route, behaviorTheme) {

            $scope.language = {
                es: "btn btn-primary btn-circle btn-outline active",
                en: "btn btn-primary btn-circle btn-outline"
            };

            $scope.notificacion = notificacion;
            $scope.actual = "";
            $scope.token_service = token_service;
            $scope.sidebarClases = behaviorTheme.sidebar;

            // optiene los menus segun el rol

            if (token_service.live_token()) {
                $scope.token = token_service.getPayload();
                if (!angular.isUndefined($scope.token.role)) {
                    var roles = "";
                    if (typeof $scope.token.role === "object") {
                        var rl = [];
                        for (var index = 0; index < $scope.token.role.length; index++) {
                            if ($scope.token.role[index].indexOf("/") < 0) {
                                rl.push($scope.token.role[index]);
                            }
                        }
                        roles = rl.toString();
                    } else {
                        roles = $scope.token.role;
                    }

                    roles = roles.replace(/,/g, '%2C');
                    configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/' + CONF.APP_MENU, '').then(function (response) {
                        if (response.data !== null) {
                            $rootScope.menu = response.data
                            behaviorTheme.initMenu(response.data);
                            $scope.menu = behaviorTheme.menu;
                        } else {
                            const datosMenu = [
                                {
                                    "Id": 362,
                                    "Nombre": "Gestion de necesidades",
                                    "Url": "",
                                    "TipoOpcion": "Menú",
                                    "Opciones": [
                                        {
                                            "Id": 363,
                                            "Nombre": "Solicitud de necesidad",
                                            "Url": "necesidad/solicitud_necesidad",
                                            "TipoOpcion": "Menú",
                                            "Opciones": null,
                                            "$$hashKey": "object:64"
                                        },
                                        {
                                            "Id": 364,
                                            "Nombre": "Consultar necesidad",
                                            "Url": "necesidades",
                                            "TipoOpcion": "Menú",
                                            "Opciones": null,
                                            "$$hashKey": "object:65"
                                        }
                                    ],
                                    "$$hashKey": "object:53"
                                },
                                {
                                    "Id": 365,
                                    "Nombre": "Editar necesidad",
                                    "Url": "necesidad/solicitud_necesidad/:IdNecesidad",
                                    "TipoOpcion": "Acción",
                                    "Opciones": null,
                                    "$$hashKey": "object:54"
                                },
                                {
                                    "Id": 366,
                                    "Nombre": "main",
                                    "Url": "/",
                                    "TipoOpcion": "Acción",
                                    "Opciones": null,
                                    "$$hashKey": "object:55"
                                }
                            ]
                            response.data = datosMenu
                            $rootScope.menu = response.data;
                            behaviorTheme.initMenu(response.data);
                            $scope.menu = behaviorTheme.menu;
                        }
                    })
                        .catch(
                            function (response) {
                                console.log('Respuesta catch', response)
                                $rootScope.menu = response.data;
                                behaviorTheme.initMenu(response.data);
                                $scope.menu = behaviorTheme.menu;
                            });
                }
            }

            $scope.redirect_url = function (path) {
                var path_sub = path.substring(0, 4);
                switch (path_sub.toUpperCase()) {
                    case "HTTP":
                        $window.open(path, "_blank");
                        break;
                    default:
                        $location.path(path);
                        break;
                }
            };

            $scope.$on('$routeChangeStart', function ( /*next, current*/) {
                $scope.actual = $location.path();
            });

            $scope.changeLanguage = function (key) {
                $translate.use(key);
                switch (key) {
                    case 'es':
                        $scope.language.es = "btn btn-primary btn-circle btn-outline active";
                        $scope.language.en = "btn btn-primary btn-circle btn-outline";
                        break;
                    case 'en':
                        $scope.language.en = "btn btn-primary btn-circle btn-outline active";
                        $scope.language.es = "btn btn-primary btn-circle btn-outline";
                        break;
                    default:
                }
                $route.reload();
            };
        });