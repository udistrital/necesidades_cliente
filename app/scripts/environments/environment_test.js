
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
        APP: "argo",
        APP_MENU: "Necesidades",
        GENERAL: {
            //no wso2
            WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services", // NO ESTA URL EN PREPROD
            ADMINISTRATIVA_MID_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8091/v1/",
            ADMINISTRATIVA_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8090/v1/",
            ADMINISTRATIVA_PRUEBAS_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8104/v1/",
            CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
            CORE_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8106/v1/",
            //CORE_AMAZON_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8205/v1/",
            CORE_AMAZON_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8106/v1/",
            PARAMETROS_GOBIERNO_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8205/v1/",
            PLAN_CUENTAS_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mid/v1/",//"http://10.20.2.126:8084/v1/",
            PLAN_CUENTAS_MONGO_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8203/v1/",
            NECESIDADES_CRUD_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/necesidades_crud/v1/",//"http://10.20.2.126:8201/v1/",
            METAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/bodega_jbpm/v1/",
            MODELS_SERVICE: "scripts/models/",
            OIKOS_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8087/v1/",
            ARGO_NOSQL_SERVICE: "http://10.20.2.43:8083/v1/", // NO ESTA URL EN PREPROD
            CONTRATO_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/contratoSuscritoProxyService/", // NO ESTA URL EN PREPROD
            NOTIFICACION_WS: "wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws/join",
            TOKEN: {
                AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
                URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
                CLIENTE_ID: "sWe9_P_C76DWGOsLcOY4T7BYH6oa",
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