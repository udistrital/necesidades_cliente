'use strict';


/**
 * @ngdoc overview
 * @name notificacionService
 * @description
 * # notificacionService
 * Service in the core.
 */

angular.module('notificacionService', [])

/**
 * @ngdoc service
 * @name notificacionService.service:notificacionRequest
 * @requires $http
 * @param {injector} $http componente http de angular
 * @requires $websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @description
 * # notificacion
 * Permite gestionar workflow de notificaciones
 */

.factory('notificacion', function( CONF, configuracionRequest, token_service, $websocket, $interval) {
        var TIME_PING = 50000;

        var log = [];
        var payload = {};
        var notificacion_estado_usuario = [];
        var no_vistos = 0;
        var addMessage = function (message) {
            methods.log = [message].concat(methods.log)
        };
        var user = "";

        var queryNotification = function () {
            configuracionRequest.get('notificacion_estado_usuario?query=Usuario:' + payload.sub + ',Activo:true&sortby=notificacion&order=asc&limit=-1', '')
                .then(function (response) {
                    if (response !== null) {
                        notificacion_estado_usuario = response.data;
                        notificacion_estado_usuario.map(function (notify) {
                            if (typeof notify.Notificacion !== 'undefined') {
                                var message = {
                                    Id: notify.Id,
                                    Type: notify.Notificacion.NotificacionConfiguracion.Tipo.Id,
                                    Content: JSON.parse(notify.Notificacion.CuerpoNotificacion),
                                    User: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Nombre,
                                    Alias: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Alias,
                                    EstiloIcono: notify.Notificacion.NotificacionConfiguracion.Aplicacion.EstiloIcono,
                                    FechaCreacion: new Date(notify.Notificacion.FechaCreacion),
                                    FechaEdicion: new Date(notify.Fecha),
                                    Estado: notify.NotificacionEstado.CodigoAbreviacion,
                                };

                                methods.addMessage(message);
                            }
                        });
                        methods.update_novistos();
                    }
                });
        };
        if (token_service.live_token()) {

            payload = token_service.getPayload();
            if (!angular.isUndefined(payload.role)) {
                var roles = "";
                var user = payload.sub;
                if (typeof payload.role === "object") {
                    var rl = [];
                    for (var index = 0; index < payload.role.length; index++) {
                        if (payload.role[index].indexOf("/") < 0) {
                            rl.push(payload.role[index]);
                        }
                    }
                    roles = rl.toString();
                } else {
                    roles = payload.role;
                }

                roles = roles.replace(/,/g, '%2C');
                // conexión websocket.
                var dataStream = $websocket(CONF.GENERAL.NOTIFICACION_WS + "?id=" + localStorage.getItem('access_token'));
                dataStream.onMessage(function (message) {
                    var mensage = JSON.parse(message.data);
                    // console.log(mensage);
                    methods.addMessage(mensage);
                    methods.update_novistos();
                });

                dataStream.onOpen(function() {
                    // console.log("open websocket with " + localStorage.getItem('access_token'))
                    $interval(function(){dataStream.send('ping')}, TIME_PING)
                });
                queryNotification();
            }
        }



        var methods = {
            id: -1,
            log: log,
            notificacion_estado_usuario: notificacion_estado_usuario,
            no_vistos: no_vistos,
            queryNotification: queryNotification,
            addMessage: addMessage,
            payload: payload,
            user: user,

            get: function () {
                dataStream.send(JSON.stringify({
                    action: 'get'
                }));
            },

            changeStateNoView: function () {
                // console.info(user)
                // console.log(methods.log.filter(function (data) { return (data.Estado).toLowerCase() === 'enviada' }))
                if (methods.log.filter(function (data) { return (data.Estado).toLowerCase() === 'enviada' }).length >= 1) {
                    configuracionRequest.post('notificacion_estado_usuario/changeStateNoView/' + user, {})
                        .then(function (response) {
                            // console.log(response);
                            methods.log = [];
                            methods.queryNotification();
                        })
                }
            },

            getNotificacionEstadoUsuario: function (id) {
                return notificacion_estado_usuario.filter(function (data) { return (data.Id === id) })[0]
            },

            update_novistos: function () {
                // console.info((methods.log.filter(function (data) { return ((data.Estado).toLowerCase() == 'enviada') })).length);
                methods.no_vistos = (methods.log.filter(function (data) { return (data.Estado.toLowerCase() === 'enviada') })).length;
            },

            changeStateToView: function (id, estado) {
                // console.log(estado);
                if (estado === 'noleida') {
                    var noti = methods.getNotificacionEstadoUsuario(id);
                    var path = 'notificacion_estado_usuario/changeStateToView/' + noti.Id;
                    // console.log(path)
                    configuracionRequest.get(path, '')
                        .then(function (response) {
                            methods.log = [];
                            methods.queryNotification();
                        });
                }
            },

        };
        return methods;
});
