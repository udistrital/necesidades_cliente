'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:listaNotificacion
 * @description
 * # listaAvances
 */
angular.module('core')
    .directive('opciones', function (CONF, $window, $location,behaviorTheme) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                children: "=",
                father: '='
            },
            templateUrl: '/core/menu-lateral/opciones-component/opciones-directive.html',
            controllerAs: 'd_opciones',

            controller: function ($scope) {
                var self = this;
                self.open = false;
                $scope.app = (CONF.APP.toLowerCase()).trim() + "-isotipo";
                $scope.app_large = (CONF.APP.toLowerCase()).trim() + "-header";
                $scope.redirect_url = function (path) {
                    var path_sub = path.substring(0, 4);
                    switch (path_sub.toUpperCase()) {
                        case "HTTP":          
                            $window.open(path, "_blank")
                            break;
                        default:
                            behaviorTheme.toogleCloseSideBar();
                             $location.path(path)
                            
                            
                            break;
                    }
                };
                $scope.toogle = function (nivel) {
                    

                    if(nivel.open==="null" || nivel.open===undefined){
                        nivel.open=false;
                    }

                    var sidebar = document.getElementById('menu-sidebar')
                    if(sidebar.className.includes("sidebar_off")){
                        behaviorTheme.toogleOpenSideBar();                        
                    }
                    if (nivel.Opciones !== null) {   
                        var opcionAbierta = nivel.Opciones.filter(function (data) {
                            return data.open
                        });
                        if (opcionAbierta.length > 0 && nivel.open) {    
                        }else {
                            nivel.open = !nivel.open;
                        }
                        if (!nivel.open ) {
                            nivel.clase = 'content-menu-off';
                            nivel.style_icon = 'opcion-down';
                            
                        } else {
                            nivel.clase = 'content-menu';
                            nivel.style_icon = 'opcion-up';
                        }
                    }
                    
                };

            }
        }
    });