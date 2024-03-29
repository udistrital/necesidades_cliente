'use strict';

angular.module('contractualClienteApp')
    .controller('menuCtrl', function ($location, $window, requestRequest, $scope, token_service, notificacion, $translate, $mdSidenav, configuracionRequest, $rootScope, $http) {
        var self = this;
        $scope.token_service = token_service;
        $scope.$on('$routeChangeStart', function (scope, next, current) {
            var waitForMenu = function () {
                if ($rootScope.my_menu !== undefined) {
                    if ($scope.token_service.live_token() && current !== undefined) {
                        if (!$scope.havePermission(next.originalPath, $rootScope.my_menu)) {
                            $location.path("/");
                        }
                    } else if (current === undefined) {
                        if (!$scope.havePermission(next.originalPath, $rootScope.my_menu)) {
                            $location.path("/");
                        }
                    }
                } else {
                    setTimeout(waitForMenu, 250);
                }
            };
            waitForMenu();



        });

        //$scope.menuserv=configuracionRequest;
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };
        $scope.notificacion = notificacion;
        $scope.actual = "";

        $scope.breadcrumb = [];

        $scope.menu_app = [
        ];
        //$scope.menu_service = [];
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
        };

        $scope.redirect_url = function (path) {
            var path_sub = path.substring(0, 4);
            switch (path_sub.toUpperCase()) {
                case "HTTP":
                    $window.open(path, "_blank");
                    break;
                case "otro":
                    break;
                default:
                    requestRequest.cancel_all();
                    $location.path(path);
                    break;
            }
        };

        $scope.havePermission = function (viewPath, menu) {
            if (viewPath !== undefined && viewPath !== null) {
                var currentPath = viewPath.substr(1);
                var head = menu;
                var permission = 0;
                if (currentPath !== "main") {
                    permission = $scope.menuWalkThrough(head, currentPath);
                } else {
                    permission = 1;
                }
                return permission;
            }
            return 1;

        };

        $scope.menuWalkThrough = function (head, url) {
            var acum = 0;
            if (!angular.isUndefined(head)) {
                angular.forEach(head, function (node) {
                    if (node.Opciones === null && node.Url === url) {
                        acum = acum + 1;
                    } else if (node.Opciones !== null) {
                        acum = acum + $scope.menuWalkThrough(node.Opciones, url);
                    } else {
                        acum = acum + 0;
                    }
                });
                return acum;
            } else {
                return acum;
            }

        };

        if (self.perfil !== undefined) {
            $scope.notificacion.get_crud('notify', $.param({
                query: "NotificacionConfiguracion.NotificacionConfiguracionPerfil.Perfil.Nombre__in:" + self.perfil.join('|') + "&sortby=id&order=asc&limit=-1"
            }))
                .then(function (response) {
                    if (response.data !== null) {
                    }
                });
        }

        if ($scope.token_service.live_token()) {
            self.perfil = $scope.token_service.getRoles();
            configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + self.perfil + '/Necesidades', '').then(function (response) {
                $rootScope.my_menu = response.data;
            }).catch(function (err) {
                console.log('error configuracion: ', err);
                $location.path("/404");
                $http.pendingRequests.forEach(function (request) {
                    if (request.cancel) {
                        request.cancel.resolve();
                    }
                });
            });
             $rootScope.my_menu = [ // menu por si deja de servir configuracion
                 {
                     Id: 1,
                     Nombre: "Gestion Necesidades",
                     Opciones: [
                         {
                            Id: 2,
                            Nombre: "Solicitud Necesidad",
                            Opciones: null,
                            TipoOpcion: "Menú",
                            Url: "necesidad/solicitud_necesidad"
                         },
                         {
                             Id: 3,
                             Nombre: "Consultar Necesidad",
                             Opciones: null,
                             TipoOpcion: "Menú",
                             Url: "necesidades"
                         }
                    ],
                    TipoOpcion: "Menú",
                     Url: ""
                 },
                 {
                     Id: 331,
                     Nombre: "Edit necesidad",
                     Url: "necesidad/solicitud_necesidad/:IdNecesidad",
                    TipoOpcion: "Acción",
                     Opciones: null
                },
                 {
                     Id: 341,
                    Nombre: "main",
                    Url: "/",
                    TipoOpcion: "Acción",
                    Opciones: null
                 }

             ];


         }

        //$scope.menuserv.actualizar_menu("Admin");
        //$scope.menu_service =$scope.menuserv.get_menu();

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        //Pendiente por definir json del menu
        (function ($) {
            $(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('ul.dropdown-menu [data-toggle=dropdown-submenu]').on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).parent().siblings().removeClass('open');
                    $(this).parent().toggleClass('open');
                });
            });
        })(jQuery);
    });
