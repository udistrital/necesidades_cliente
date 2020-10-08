'use strict';


/**
 * @ngdoc overview
 * @name notificacionService
 * @description
 * # notificacionService
 * Service in the core.
 */

angular.module('themeService', [])

/**
 * @ngdoc service
 * @name themeService.service:behaviorTheme
 * @requires $http
 * @param {injector} $http componente http de angular
 * @requires $websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @description
 * # notificacion
 * Permite gestionar workflow de notificaciones
 */

.factory('behaviorTheme', function( CONF, configuracionRequest) {

        var methods = {
            sidebar: {
                open: false,
                sidebarDivClase: 'sidebar_off',
                sidebarContainerClase: 'main-container-sidebar-off',
                containerDivClase: 'container-view',
                containerBodyClase: 'container-body',
                containerLogoCollapsedClase: 'inline-block',
                containerLogoClase: 'none',
                textoMenuLateralClase: 'menulateral-text'
            },
            aplicacion: {
                open:false,
                clase: 'apps_menu_container',
                scroll: false,
                scrollClase : 'container-aplicativos'
            },
            notificacion: {
                open:false,
                clase: 'notificacion_container'
            },
            menu: [],
            initMenu: function (menu) {
                methods.menu = menu;
            },

            toogleOpenSideBar: function (){
                
                var textoMenuLateral = document.getElementsByClassName("menulateral-text");
                if (!methods.sidebar.open){
                    for(var i =0, il = textoMenuLateral.length;i<il;i++){
                        textoMenuLateral[i].classList.remove("oculto");
                    }
                    methods.sidebar.sidebarDivClase = 'sidebar_is_active';
                    methods.sidebar.sidebarContainerClase = 'main-container-sidebar';
                    methods.sidebar.containerDivClase = 'container-view';
                    methods.sidebar.containerBodyClase = 'container-body-off';
                    methods.sidebar.containerLogoCollapsedClase = 'inline-block';
                    methods.sidebar.containerLogoClase = 'none';
                    methods.sidebar.open=true;
         
                }
            },
            toogleCloseSideBar: function (){
                var textoMenuLateral = document.getElementsByClassName("menulateral-text");
                if (methods.sidebar.open) {
                    methods.closeAllMenu(methods.menu);
                    for(var i =0, il = textoMenuLateral.length;i<il;i++){
                        textoMenuLateral[i].classList.add("oculto");
                    }
                    methods.sidebar.sidebarDivClase = 'sidebar_off';
                    methods.sidebar.sidebarContainerClase = 'main-container-sidebar-off';
                    methods.sidebar.containerBodyClase = 'container-body';
                    methods.sidebar.containerLogoCollapsedClase = 'none';
                    methods.sidebar.containerLogoClase = 'inline-block';
                    methods.sidebar.open=false;
                }  
                
            },
            toogleSidebar: function () {
                var textoMenuLateral = document.getElementsByClassName("menulateral-text");
                methods.sidebar.open = !methods.sidebar.open;
                if (!methods.sidebar.open) {
                    methods.closeAllMenu(methods.menu);
                    for(var i =0, il = textoMenuLateral.length;i<il;i++){
                        textoMenuLateral[i].classList.add("oculto");
                    }
                    methods.sidebar.sidebarDivClase = 'sidebar_off';
                    methods.sidebar.sidebarContainerClase = 'main-container-sidebar-off';
                    methods.sidebar.containerBodyClase = 'container-body';
                    methods.sidebar.containerLogoCollapsedClase = 'none';
                    methods.sidebar.containerLogoClase = 'inline-block';
                }else {
                    for(var i =0, il = textoMenuLateral.length;i<il;i++){
                        textoMenuLateral[i].classList.remove("oculto");
                    }
                    methods.sidebar.sidebarDivClase = 'sidebar_is_active';
                    methods.sidebar.sidebarContainerClase = 'main-container-sidebar';
                    methods.sidebar.containerDivClase = 'container-view';
                    methods.sidebar.containerBodyClase = 'container-body-off';
                    methods.sidebar.containerLogoCollapsedClase = 'inline-block';
                    methods.sidebar.containerLogoClase = 'none';
                }
            },

            closeAllMenu: function(menu) {           
                methods.menu = menu.map(function(n) {
                    var node = {};
                    node = {
                        open: false,
                        clase: "content-menu-off",
                        style_icon : 'opcion-down'
                    };
                    if (n.hasOwnProperty('Opciones')) {
                        if (n.Opciones !== null) {
                            var children = { Opciones: methods.closeAllMenu(n.Opciones)};

                            node = Object.assign(n, node, children);
                        }else {
                            var children = { Opciones: null }
                            node = Object.assign(n, node, children);
                        }
                        return node;
                    } else {
                        
                        return node;
                    }
                });
                return methods.menu;
            },

            toogleNotificacion: function () {
                if (methods.aplicacion.open) {
                    methods.toogleAplicacion();
                }
                methods.notificacion.open = !methods.notificacion.open;
                if (methods.notificacion.open) {
                    methods.notificacion.clase = 'notificacion_container menu_is_active';
                }else {
                    methods.notificacion.clase = 'notificacion_container';
                }
            },


            toogleAplicacion: function () {
                var containerApps=document.getElementById('menu-aplicaciones')
                methods.aplicacion.scroll = $(containerApps).hasScrollBar();
                if (methods.notificacion.open) {
                    methods.toogleNotificacion();
                }
                if(!methods.aplicacion.scroll){
                    methods.aplicacion.scrollClase = "container-aplicativos";
                }else{

                    methods.aplicacion.scrollClase = "container-aplicativos-scroll";
                }
                methods.aplicacion.open = !methods.aplicacion.open;
                if (methods.aplicacion.open) {
                    methods.aplicacion.clase = 'apps_menu_container menu_is_active';
                }else {
                    methods.aplicacion.clase = 'apps_menu_container';
                }
            },
        };
        return methods;
});

(function($) {
    $('body').removeClass('modal-backdrop fade in');
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);
