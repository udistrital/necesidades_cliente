'use strict';

// Reemplace MODULE_APP por el nombre del módulo de la aplicación principal

/**
 * @ngdoc service
 * @name MODULE_APP.config
 * @description
 * # config
 * Constant in the MODULE_APP.
 */


angular.module('MODULE_APP')
  .constant('CONF', {
    APP: "", // Nombre de la app, esto cargará el logo.
    APP_MENU: "", // Ingrese valor de la aplicación asociado al menú registrado en wso2
    GENERAL: {
      WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
      CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/api/configuracion_crud_api/v1/",
      NOTIFICACION_WS: "wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws/join",
      TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
      },
    },
  });
