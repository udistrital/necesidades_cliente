'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.config
 * @description
 * # config
 * Constant in the contractualClienteApp.
 */

angular.module('contractualClienteApp')
    .constant('CONF', {
        APP: "kronos",
        APP_MENU: "Necesidades",
        GENERAL: {
            WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/", // NO ESTA URL EN PREPROD
            ADMINISTRATIVA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
            ADMINISTRATIVA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
            ADMINISTRATIVA_PRUEBAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
            CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
            CORE_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
            CORE_AMAZON_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/",
            PARAMETROS_GOBIERNO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros_gobierno/v1/",
            CATALOGO_ARKA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/catalogo_elementos_crud/v1/",
            PLAN_CUENTAS_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mid/v1/',
            PLAN_CUENTAS_MONGO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mongo_crud/v1/',
            NECESIDADES_CRUD_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/necesidades_crud/v1/",
            METAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/bodega_jbpm/v1/",
            MODELS_SERVICE: "scripts/models/",
            PARAMETROS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/", // PARAMETROS NUEVOS
            OIKOS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/",
            ARGO_NOSQL_SERVICE: "http://10.20.2.43:8083/v1/", // NO ESTA URL EN PREPROD
            CONTRATO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/", // NO ESTA URL EN PREPROD
            NOTIFICACION_WS: "wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws/join",
            TOKEN: {
                AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
                URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
                CLIENTE_ID: "AYlkE7sU8jftbmV9NY4TJRfA0nsa",
                REDIRECT_URL: "https://pruebasnecesidades.portaloas.udistrital.edu.co",
                RESPONSE_TYPE: "id_token token",
                SCOPE: "openid email documento",
                BUTTON_CLASS: "btn btn-warning btn-sm",
                SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
                SIGN_OUT_REDIRECT_URL: "https://pruebasnecesidades.portaloas.udistrital.edu.co",
                SIGN_OUT_APPEND_TOKEN: "true",
            },
        },
    });

