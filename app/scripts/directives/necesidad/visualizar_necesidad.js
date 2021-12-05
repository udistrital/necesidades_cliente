'use strict';


//import { ConsoleReporter } from "jasmine";


/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:necesidad/visualizarNecesidad
 * @description
 * # necesidad/visualizarNecesidad
 */
angular.module('contractualClienteApp')
    .directive('visualizarNecesidad', function () {
        return {
            restrict: 'E',
            scope: {
                numero: '=',
                estado: '=',
                modalidadSel: '=?',
                tipoContrato: '=',
                necesidad: '=?'
            },
            templateUrl: 'views/directives/necesidad/visualizar_necesidad.html',
            controller: function (metasRequest, agoraRequest, oikosRequest, necesidadService, coreAmazonRequest, necesidadesCrudRequest, planCuentasRequest, $scope) {
                var self = this;
                self.verJustificacion = false;
                self.justificaciones_rechazo = [];
                self.v_necesidad = null;
                self.solicitud_disponibilidad = null;
                self.modalidadSel = {};
                var metas = {};
                self.dataDias = null;

                $scope.$watch('necesidad', function () {

                    if (!$scope.necesidad) {
                        return
                    }
                    self.verJustificacion = null;
                    self.cargar_necesidad();
                    if ($scope.necesidad.Necesidad.TipoFinanciacionNecesidadId.CodigoAbreviacion === 'F') {
                        self.funcionamiento = true;
                    } else {
                        self.funcionamiento = false;
                    }

                    if ($scope.necesidad.Necesidad.EstadoNecesidadId.CodigoAbreviacionn === 'R') {
                        necesidadesCrudRequest.get('necesidad_rechazada', $.param({
                            query: 'NecesidadId:' + $scope.necesidad.Necesidad.Id
                        })).then(function (response) {
                            if (response.data !== null && response.status === 200) {
                                self.verJustificacion = response.data;
                            }
                        });
                    }
                    if (["CDPE", "CDPA"].includes($scope.necesidad.Necesidad.EstadoNecesidadId.CodigoAbreviacionn)) {
                        planCuentasRequest.get('solicitudesCDP/?query=necesidad:' + $scope.necesidad.Necesidad.Id).then(function (response) {
                            if (response.status === 200) {
                                var id_sol_cdp = response.data.Body[0]._id;
                                planCuentasRequest.get('documento_presupuestal/' + $scope.necesidad.Necesidad.Vigencia + '/' + $scope.necesidad.Necesidad.AreaFuncional + '?query=tipo:cdp,data.solicitud_cdp:' + id_sol_cdp).then(function (res) {
                                    $scope.necesidad.documento_cdp = res.data.Body[0];
                                })
                            }
                        })
                    }
                    $scope.necesidad.Rubros.map(function(r){
                      r.Metas.map(function(res){
                        metasRequest.get("Meta/"+res.MetaId).then(function(resp){
                          res.Nombre = resp.data.Nombre;
                        })
                        res.Actividades.map(function(resa){

                          metasRequest.get("Actividad/"+resa.ActividadId).then(function(resp){

                            resa.Nombre = resp.data.Nombre;
                          })
                        })
                      })
                    });
                    var dataDias = necesidadService.calculo_total_dias_rev($scope.necesidad.Necesidad.DiasDuracion);
                    self.dataDias = dataDias;
                });

                $scope.$watch('d_visualizarNecesidad.modalidadSel', function () {
                    $scope.modalidadSel = self.modalidadSel;
                });

                function get_jefe_dependencia(id_jefe_dependencia, solicitante) {
                    coreAmazonRequest.get('jefe_dependencia', $.param({
                        query: 'Id:' + id_jefe_dependencia
                    })).then(function (response_jefe_dependencia) {
                        agoraRequest.get('informacion_persona_natural', $.param({
                            query: 'Id:' + response_jefe_dependencia.data[0].TerceroId
                        })).then(function (response_persona_natural) {
                            if (response_persona_natural.data !== null && response_persona_natural.status === 200) {
                                if (solicitante) {
                                    self.jefe_dependencia_solicitante = response_persona_natural.data[0];
                                } else {
                                    self.jefe_dependencia_destino = response_persona_natural.data[0];
                                }
                            }
                        });
                    });
                }

                function get_dependencia(id_jefe_dependencia, solicitante) {
                    coreAmazonRequest.get('jefe_dependencia', $.param({
                        query: 'Id:' + id_jefe_dependencia
                    })).then(function (response_jefe_dependencia) {
                        oikosRequest.get('dependencia', $.param({
                            query: 'Id:' + response_jefe_dependencia.data[0].DependenciaId
                        })).then(function (response_dependencia) {
                            if (response_dependencia.data !== null && response_dependencia.status === 200) {
                                if (solicitante) {
                                    self.dependencia_solicitante = response_dependencia.data[0];
                                    metasRequest.get('plan_adquisiciones/' + $scope.necesidad.Necesidad.Vigencia +
                                        "/" + response_dependencia.data[0].Id).then(function (response) {

                                            if (response.data !== null && response.status === 200) {
                                                metas = response.data.metas;
                                                $scope.necesidad.Rubros.forEach(get_informacion_meta);
                                            }
                                        });
                                } else {
                                    self.dependencia_destino = response_dependencia.data[0];
                                }
                            }
                        });
                    });
                }

                function get_informacion_meta(rubro) {
                    rubro.Metas ? rubro.Metas.forEach(function (meta) {
                        meta.InfoMeta = metas.actividades.find(function (item) {
                            return item.meta_id === meta.MetaId
                        });
                        meta.Actividades.forEach(function (actividad) {
                            actividad.InfoActividad = metas.actividades.find(function (item) {
                                return actividad.ActividadId === item.actividad_id
                            });
                        });
                    }) : _;
                }


                self.cargar_necesidad = function () {
                    self.marco_legal = $scope.necesidad.MarcoLegalNecesidad;
                    self.v_necesidad = $scope.necesidad.Necesidad;
                    self.rubros = $scope.necesidad.Rubros;

                    // Jefes de dependencias
                    get_jefe_dependencia($scope.necesidad.Necesidad.DependenciaNecesidadId.JefeDepSolicitanteId, true);
                    get_jefe_dependencia($scope.necesidad.Necesidad.DependenciaNecesidadId.JefeDepDestinoId, false);
                    //Información de dependencias
                    get_dependencia($scope.necesidad.Necesidad.DependenciaNecesidadId.JefeDepSolicitanteId, true);
                    get_dependencia($scope.necesidad.Necesidad.DependenciaNecesidadId.JefeDepDestinoId, false);
                    // Información del ordenador de gasto
                    necesidadService.getJefeDependencia($scope.necesidad.Necesidad.DependenciaNecesidadId.OrdenadorGastoId, true).then(function (response) {
                        self.ordenador_gasto = response.Persona;
                    });

                    if ($scope.necesidad.Necesidad.TipoContratoId && $scope.necesidad.Necesidad.TipoContratoId !== 0) {
                        agoraRequest.get('tipo_contrato/' + $scope.necesidad.Necesidad.TipoContratoId).then(function (response) {
                            self.v_necesidad.TipoContratoId = response.data;
                        });
                    }
                };
            },
            controllerAs: 'd_visualizarNecesidad'
        };
    });
