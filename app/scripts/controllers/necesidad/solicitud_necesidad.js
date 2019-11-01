'use strict';

/**
 * 
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadSolicitudNecesidadCtrl
 * @description
 * # NecesidadSolicitudNecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SolicitudNecesidadCtrl', function (administrativaRequest, necesidadesCrudRequest, planCuentasRequest, planCuentasMidRequest, $scope, $sce, $http, $filter, $window, agoraRequest, parametrosGobiernoRequest, coreAmazonRequest, $translate, $routeParams, necesidadService) {
        var self = this;

        self.IdNecesidad = $routeParams.IdNecesidad;
        self.iva_data = undefined;
        self.documentos = [];
        self.avance = undefined;
        self.formuIncompleto = true;
        self.Necesidad = {
            DependenciaNecesidadId: {
                InterventorId: undefined,
                JefeDepDestinoId: undefined,
                JefeDepSolicitanteId: undefined,
                SupervisorId: undefined
            },
        };

        self.DetalleServicioNecesidad = {
        };

        self.DetallePrestacionServicioNecesidad = {
        };

        self.ActividadEspecificaNecesidad = [];
        self.MarcoLegalNecesidad = [];


        self.meta = undefined;
        self.meta_necesidad = {
            Meta: undefined,
            Actividades: [],
            MontoPorMeta: 0
        };
        self.actividades = undefined;
        self.apSelected = false;
        self.apSelectedOb = undefined;
        self.jefes_dep_data = undefined;
        self.producto_catalogo = {};
        self.producto_catalogo.RequisitosMinimos = [];


        self.fecha_actual = new Date();
        self.Necesidad.Vigencia = self.fecha_actual.getFullYear() + "";
        self.vigencia = 2019;
        self.deepCopy = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };

        self.variable = { };

        self.DuracionEspecial = 'unico_pago';
        self.fecha = new Date();
        self.Rubros = [];
        self.ActividadEspecifica = [];
        self.especificaciones = [];
        self.requisitos_minimos = [];
        self.actividades_economicas = [];
        self.actividades_economicas_id = [];
        self.productos = [];
        self.Necesidad.Valor = 0;
        self.servicio_valor = 0;
        self.valor_compra_servicio = 0;
        self.meta_valor = 0;
        self.asd = [];
        self.valorTotalEspecificaciones = 0;
        self.subtotalEspecificaciones = 0;
        self.valorIVA = 0;
        self.FormularioSeleccionado = 0;
        self.tipoInterventor = false;


        self.planes_anuales = [{
            Id: 1,
            Nombre: "Plan de Adquisición 2019"
        }];

        self.duracionEspecialMap = {
            duracion: [true, false, false, undefined],
            unico_pago: [true, true, false, undefined],
            agotar_presupuesto: [true, false, true, undefined]
        };


        self.SeccionesFormulario = {
            general: {
                activo: true,
                completado: true,
            },
            financiacion: {
                activo: true,
                completado: true,
            },
            legal: {
                activo: true,
                completado: true,
            },
            contratacion: {
                activo: true,
                completado: true,
            }
        };


        // El tipo de solicitud de contrato
        self.duracionEspecialFunc = function (especial) {
            //self.necesidad.DiasDuracion = necesidadService.calculo_total_dias(self.anos, self.meses, self.dias);
            self.Necesidad.DiasDuracion = necesidadService.calculo_total_dias(self.anos, self.meses, self.dias);
            var s = self.duracionEspecialMap[especial];
            if (!s) { return; }

            self.ver_duracion_fecha = s[0];
            // self.necesidad.UnicoPago = s[1];
            // self.necesidad.AgotarPresupuesto = s[2];
            // self.necesidad.DiasDuracion = s[3] === undefined ? self.necesidad.DiasDuracion : s[3];
        };

        self.duracionEspecialReverse = function () {

                    self.ver_duracion_fecha = true
            
        };

        // necesidadService.getFullNecesidad(self.IdNecesidad).then(function(trNecesidad){
        //     console.info("llego", trNecesidad)
        //     self.Necesidad=trNecesidad.Necesidad;
        //     self.DetalleServicioNecesidad=trNecesidad.DetalleServicioNecesidad;
        //     self.DetallePrestacionServicioNecesidad=trNecesidad.DetallePrestacionServicioNecesidad;
        //     self.ProductosCatalogoNecesidad=trNecesidad.ProductosCatalogoNecesidad;
        //     self.MarcoLegalNecesidad=trNecesidad.MarcoLegalNecesidad;
        //     self.ActividadEspecificaNecesidad=trNecesidad.ActividadEspecificaNecesidad;
        //     self.ActividadEconomicaNecesidad=trNecesidad.ActividadEconomicaNecesidad;
        //     self.Rubros=trNecesidad.Rubros;
        //     self.duracionEspecialReverse();
        //     self.dep_ned = trNecesidad.DependenciaSolicitante;
        //     self.dependencia_destino = trNecesidad.DependenciaDestino;
        //     self.rol_ordenador_gasto = trNecesidad.RolOrdenadorGasto;
        //     var data = necesidadService.calculo_total_dias_rev(self.Necesidad.DiasDuracion);
        //     self.anos = data.anos;
        //     self.meses = data.meses;
        //     self.dias = data.dias;


        // }
            
        // );

        necesidadService.initNecesidad(self.IdNecesidad).then(function (trNecesidad) {
            self.Rubros = trNecesidad[1];
            trNecesidad = trNecesidad[0];
            self.necesidad = trNecesidad.Necesidad;
            // self.detalle_servicio_necesidad = trNecesidad.Necesidad.DetalleServicioNecesidad;
            // self.detalle_servicio_necesidad.Cantidad = 1;
            self.ActividadEspecifica = trNecesidad.Necesidad.ActividadEspecifica || [];

            // if (self.Necesidad.TipoContratoNecesidadId.Id === 2) {
            //     self.actividades_economicas_id = trNecesidad.ActividadEconomicaNecesidad.map(function (d) {
            //         return parseInt(d.ActividadEconomica, 10);
            //     });
            // }

            if (trNecesidad.Ffapropiacion) {
                self.f_apropiaciones = trNecesidad.Ffapropiacion;
                self.f_apropiaciones.forEach(function (element) {
                    var cantidadFuentes = element.apropiacion.Fuentes.length;

                    for (var i = 0; i < cantidadFuentes; i += 1) {
                        element.apropiacion.Fuentes[i].FuenteFinanciamiento = apropiacion.Fuentes[i].InfoFuente;
                    }

                    self.Rubros.push({
                        Codigo: element.Codigo,
                        apropiacion: element.Apropiacion,
                        // fuentes: apropiacion.Fuentes,
                        initFuentes: apropiacion.Fuentes,
                        Monto: element.Apropiacion.ApropiacionInicial,
                        productos: element.apropiacion.Productos,
                        initProductos: element.Apropiacion.Productos,

                    });

                });
            }

            self.documentos = trNecesidad.MarcoLegalNecesidad ? trNecesidad.MarcoLegalNecesidad.map(function (d) { return d.MarcoLegal; }) : [];
            self.dep_ned = trNecesidad.DependenciaNecesidad;
            self.dependencia_destino = trNecesidad.DependenciaNecesidadDestino;
            self.rol_ordenador_gasto = trNecesidad.RolOrdenadorGasto;
            self.duracionEspecialReverse();
            var data = necesidadService.calculo_total_dias_rev(self.necesidad.DiasDuracion);
            self.anos = data.anos;
            self.meses = data.meses;
            self.dias = data.dias;

            $scope.$watch('solicitudNecesidad.Necesidad', function () {
                localStorage.setItem("Necesidad", JSON.stringify(self.Necesidad));
            }, true)


            $scope.$watch('solicitudNecesidad.detalle_servicio_necesidad.NucleoConocimiento', function () {
                if (!self.detalle_servicio_necesidad) { return; }
                parametrosGobiernoRequest.get('nucleo_basico_conocimiento', $.param({
                    query: 'Id:' + self.detalle_servicio_necesidad.NucleoConocimiento,
                    limit: -1
                })).then(function (response) {
                    if (response.data !== null && response.data.lenght > 0) {
                        self.nucleoarea = response.data[0].AreaConocimientoId.Id;
                    }

                }).catch(function (err) {
                    console.error(err)
                });
            }, true);

            $scope.$watch('solicitudNecesidad.dependencia_solicitante', function () {
                self.jefe_solicitante = null;
                self.dependencia_solicitante ?
                    necesidadService.getJefeDependencia(self.dependencia_solicitante).then(function (JD) {
                        self.jefe_solicitante = JD.Persona;
                        self.Necesidad.DependenciaNecesidadId.JefeDepSolicitanteId = JD.JefeDependencia.Id;
                        // self.dependencia_solicitante.JefeDependenciaSolicitante = JD.JefeDependencia.Id; OLD
                    }).catch(function (err) {
                    }) : _;
            }, true);


            $scope.$watch('solicitudNecesidad.dependencia_destino', function () {
                self.jefe_destino = null;
                self.dependencia_destino ?
                    necesidadService.getJefeDependencia(self.dependencia_destino).then(function (JD) {
                        self.jefe_destino = JD.Persona;
                        self.dep_ned.JefeDependenciaDestino = JD.JefeDependencia.Id;
                        self.Necesidad.DependenciaNecesidadId.JefeDepDestinoId = self.dep_ned.JefeDependenciaDestino;
                    }).catch(function (err) {
                    }) : _;

            }, true);

            $scope.$watch('solicitudNecesidad.dependencia_supervisor', function () {
                self.supervisor = null;
                self.dependencia_supervisor ?
                    necesidadService.getJefeDependencia(self.dependencia_supervisor).then(function (JD) {
                        self.supervisor = JD.Persona;
                        self.dep_ned.supervisor = JD.JefeDependencia.Id;
                        self.Necesidad.DependenciaNecesidadId.SupervisorId = self.dep_ned.supervisor;
                    }).catch(function (err) {
                    }) : _;


            }, true);


            $scope.$watch('solicitudNecesidad.rol_ordenador_gasto', function () {
                self.ordenador_gasto = null;
                self.rol_ordenador_gasto ?
                    necesidadService.getJefeDependencia(self.rol_ordenador_gasto).then(function (JD) {
                        self.ordenador_gasto = JD.Persona;
                        self.Necesidad.DependenciaNecesidadId.OrdenadorGastoId = parseInt(JD.Persona.Id, 10);
                    }).catch(function (err) {
                    }) : _;
            }, true);
        });

        // $scope.$watch('solicitudNecesidad.Necesidad', function () {
        //     localStorage.setItem("Necesidad", self.Necesidad);
        // }, true)


        // $scope.$watch('solicitudNecesidad.detalle_servicio_necesidad.NucleoConocimiento', function () {
        //     if (!self.detalle_servicio_necesidad) { return; }
        //     parametrosGobiernoRequest.get('nucleo_basico_conocimiento', $.param({
        //         query: 'Id:' + self.detalle_servicio_necesidad.NucleoConocimiento,
        //         limit: -1
        //     })).then(function (response) {
        //         if (response.data !== null && response.data.lenght > 0) {
        //             self.nucleoarea = response.data[0].AreaConocimientoId.Id;
        //         }

        //     }).catch(function (err) {
        //         console.error(err)
        //     });
        // }, true);

        // $scope.$watch('solicitudNecesidad.dependencia_solicitante', function () {
        //     self.jefe_solicitante = null;
        //     self.dependencia_solicitante ?
        //         necesidadService.getJefeDependencia(self.dependencia_solicitante).then(function (JD) {
        //             self.jefe_solicitante = JD.Persona;
        //             self.Necesidad.DependenciaNecesidadId.JefeDepSolicitanteId = JD.JefeDependencia.Id;
        //             // self.dependencia_solicitante.JefeDependenciaSolicitante = JD.JefeDependencia.Id; OLD
        //         }).catch(function (err) {
        //         }) : _;
        // }, true);


        // $scope.$watch('solicitudNecesidad.dependencia_destino', function () {
        //     self.jefe_destino = null;
        //     self.dependencia_destino ?
        //         necesidadService.getJefeDependencia(self.dependencia_destino).then(function (JD) {
        //             self.jefe_destino = JD.Persona;
        //             self.dep_ned.JefeDependenciaDestino = JD.JefeDependencia.Id;
        //             self.Necesidad.DependenciaNecesidadId.JefeDepDestinoId = self.dep_ned.JefeDependenciaDestino;
        //         }).catch(function (err) {
        //         }) : _;

        // }, true);

        // $scope.$watch('solicitudNecesidad.dependencia_supervisor', function () {
        //     self.supervisor = null;
        //     self.dependencia_supervisor ?
        //         necesidadService.getJefeDependencia(self.dependencia_supervisor).then(function (JD) {
        //             self.supervisor = JD.Persona;
        //             self.dep_ned.supervisor = JD.JefeDependencia.Id;
        //             self.Necesidad.DependenciaNecesidadId.SupervisorId = self.dep_ned.supervisor;
        //         }).catch(function (err) {
        //         }) : _;


        // }, true);


        // $scope.$watch('solicitudNecesidad.rol_ordenador_gasto', function () {
        //     self.ordenador_gasto = null;
        //     self.rol_ordenador_gasto ?
        //         necesidadService.getJefeDependencia(self.rol_ordenador_gasto).then(function (JD) {
        //             self.ordenador_gasto = JD.Persona;
        //             self.Necesidad.DependenciaNecesidadId.OrdenadorGastoId = parseInt(JD.Persona.Id, 10);
        //         }).catch(function (err) {
        //         }) : _;
        // }, true);

        self.estructura = {
            init: {
                forms: {
                    Avances: false,
                    Responsables: true,
                    General: true,
                    ObjetoContractual: true,
                    MarcoLegal: true,
                    Especificaciones: true,
                    Financiamiento: true,
                },
                Responsables: {
                    DependenciaSolicitante: true,
                    JefeDependenciaSolicitante: true,
                    DependenciaDestino: true,
                    JefeDependenciaDestino: true,
                    OrdenadorGasto: true,
                    RolOrdenadorGasto: true,
                },
                General: {
                    PlanAnualAdquisiciones: true,
                    UnidadEjecutora: true,
                    EstudioMercado: true,
                    ModalidadSeleccion: true,
                    Supervisor: true,
                    AnalisisRiesgo: true,
                },
                ObjetoContractual: {
                    ObjetoContrato: true,
                    JustificacionContrato: true,
                }
            },
            Contratacion: {
                forms: {
                },
            },
            Avances: {
                forms: {
                    Avances: true,
                    Especificaciones: false,
                },
                General: {
                    EstudioMercado: false,
                    ModalidadSeleccion: false,
                    Supervisor: false,
                },
            },
            ServiciosPublicos: {
                forms: {
                    //Avances: false,
                    Especificaciones: false,
                },
                General: {
                    EstudioMercado: false,
                    ModalidadSeleccion: false,
                    Supervisor: false,
                },
            }
        };

        self.forms = _.extend({}, self.estructura.init.forms);
        self.fields = _.extend({}, self.estructura.init);

        var alertInfo = {
            type: 'error',
            title: 'Complete todos los campos obligatorios en el formulario',
            showConfirmButton: false,
            timer: 2000,
        };

        self.validar_formu = function (form) {
            if (form.$invalid) {
                swal(alertInfo);
                return false;
            } else {
                return true;
            }
        };

        // coreAmazonRequest.get('jefe_dependencia/' + self.dep_ned.JefeDependenciaSolicitante, $.param({ query: 'FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD') })).then(function (response) {
        //     self.dependencia_solicitante_data = response.data;
        // });

        $scope.$watch('solicitudNecesidad.especificaciones.Valor', function () {
            self.valor_iva = (self.especificaciones.Iva / 100) * self.especificaciones.Valor * self.especificaciones.Cantidad;
        }, true);

        $scope.$watch('solicitudNecesidad.especificaciones.Iva', function () {
            self.valor_iva = (self.especificaciones.Iva / 100) * self.especificaciones.Valor * self.especificaciones.Cantidad;
        }, true);

        $scope.$watch('solicitudNecesidad.especificaciones.Cantidad', function () {
            self.valor_iva = (self.especificaciones.Iva / 100) * self.especificaciones.Valor * self.especificaciones.Cantidad;
        }, true);

        $scope.$watch('solicitudNecesidad.valor_iva', function () {
            self.valor_total = (self.especificaciones.Valor * self.especificaciones.Cantidad) + self.valor_iva;
        }, true);

        parametrosGobiernoRequest.get('area_conocimiento', $.param({ //Primer Select NAC
            limit: -1,
            query: 'Activo:true'
        })).then(function (response) {
            self.nucleo_area_data = response.data;
        });

        parametrosGobiernoRequest.get('vigencia_impuesto', $.param({
            limit: -1,
            query: 'Activo:true'
        })).then(function (response) {
            self.iva_data = response.data;
            console.info(self.iva_data)
        });


        $scope.$watch('solicitudNecesidad.nucleoarea', function () {
            self.nucleoarea ?
                parametrosGobiernoRequest.get('nucleo_basico_conocimiento', $.param({
                    query: 'AreaConocimientoId.Id:' + self.nucleoarea,
                    limit: -1
                })).then(function (response) {
                    self.nucleo_conocimiento_data = response.data;
                }) : _;
        }, true);

        $scope.$watch('solicitudNecesidad.necesidad.TipoNecesidad.Id', function () {
            if (!self.necesidad) {
                return;
            }
            var TipoNecesidad = self.necesidad.TipoNecesidad.Id;
            self.CambiarTipoNecesidad(TipoNecesidad);
        });

        $scope.$watchGroup(['solicitudNecesidad.necesidad.UnidadEjecutora', 'solicitudNecesidad.Necesidad.TipoFinanciacionNecesidadId'], function () {
            // reset financiacion si se cambia de tipo finaciacion o unidad ejecutora
            self.Rubros = [];
        })

        necesidadService.getAllDependencias().then(function (Dependencias) {
            self.dependencia_data = Dependencias;
        });

        coreAmazonRequest.get('ordenador_gasto', $.param({
            limit: -1,
            sortby: "Cargo",
            order: "asc",
        })).then(function (response) {
            self.ordenador_gasto_data = response.data;
        }).catch(function (err) {
            //solucion cuestonablemente provisional  porque el servicio core no responde en json
            self.ordenador_gasto_data = [
                {
                    Id: 7,
                    Cargo: 'Decano Facultad Ciencias y Educación',
                    DependenciaId: 17
                },
                {
                    Id: 10,
                    Cargo: 'Decano Facultad de Artes',
                    DependenciaId: 35
                },
                {
                    Id: 8,
                    Cargo: 'Decano Facultad de Medio Ambiente',
                    DependenciaId: 65
                },
                {
                    Id: 6,
                    Cargo: 'Decano Facultad Ingeniería',
                    DependenciaId: 14
                },
                {
                    Id: 9,
                    Cargo: 'Decano Facultad Tecnológica',
                    DependenciaId: 66
                },
                {
                    Id: 4,
                    Cargo: 'Director Centro de Investigaciones y Desarrollo Científico',
                    DependenciaId: 43
                },
                {
                    Id: 11,
                    Cargo: 'Director IDEXUD',
                    DependenciaId: 12
                },
                {
                    Id: 3,
                    Cargo: 'Rector',
                    DependenciaId: 7
                },
                {
                    Id: 5,
                    Cargo: 'Secretario General',
                    DependenciaId: 9
                },
                {
                    Id: 1,
                    Cargo: 'Vicerrector Académico',
                    DependenciaId: 8
                },
                {
                    Id: 2,
                    Cargo: 'Vicerrector Administrativo y Financiero',
                    DependenciaId: 15
                }
            ]
        });


        //TODO: usar el servicio de unidad ejecutora cuando exista

        self.unidad_ejecutora_data = [{ Id: 1, Nombre: 'Rector' }, { Id: 2, Nombre: 'Convenios' }]; //PRovisional esta asquerosidad :) 


        necesidadesCrudRequest.get('tipo_necesidad', $.param({
            limit: -1
        })).then(function (response) {
            self.tipo_necesidad_data = response.data;

        });

        necesidadesCrudRequest.get('tipo_duracion_necesidad', $.param({
            limit: -1
        })).then(function (response) {
            self.tipo_duracion_necesidad_data = response.data;
        });


        agoraRequest.get('unidad', $.param({
            limit: -1,
            sortby: "Unidad",
            order: "asc",
        })).then(function (response) {
            self.unidad_data = response.data;
        });


        coreAmazonRequest.get('jefe_dependencia', $.param({
            limit: -1,
            query: 'FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD')
        })).then(function (responseJD) {
            self.jefes_dep_data = responseJD;

        });
        // Se traen los jefes de dependencia actuales 
        agoraRequest.get('informacion_persona_natural', $.param({
            limit: -1,
        })).then(function (response) {
            var arrJD = [];
            self.interventor_data = response.data;
            self.persona_data = response.data.filter(function (p) {
                self.jefes_dep_data.data.forEach(function (i) {
                    if (p.Id == i.TerceroId) {
                        arrJD.push(p);
                    }

                })
                return arrJD;
            });
        });

        necesidadService.getParametroEstandar().then(function (response) {
            self.parametro_estandar_data = response.data;
        });
        //-----

        administrativaRequest.get('modalidad_seleccion', $.param({
            limit: -1,
            sortby: "NumeroOrden",
            order: "asc",
        })).then(function (response) {
            self.modalidad_data = response.data;
        });

        necesidadesCrudRequest.get('tipo_financiacion_necesidad', $.param({
            limit: -1
        })).then(function (response) {
            self.tipo_financiacion_data = response.data;
        });

        necesidadesCrudRequest.get('tipo_contrato_necesidad', $.param({
            limit: -1,
            query: 'Activo:true'
        })).then(function (response) {
            self.tipo_contrato_data = response.data;
        });

        $http.get("scripts/models/marco_legal.json")
            .then(function (response) {

                self.MarcoLegalNecesidadText = $sce.trustAsHtml(response.data.common_text);

            });

        // Se carga JSON con los tipos de servicio
        $http.get("scripts/models/tipo_servicio.json")
            .then(function (response) {
                self.TiposServicios = response.data;

            });

        self.agregar_ffapropiacion = function (apropiacion) {
            if (apropiacion === undefined) {
                return;
            }
            self.apSelected = true;
            self.apSelectedOb = apropiacion;
            var Fap = {
                Apropiacion: apropiacion,
                RubroId: apropiacion.Codigo,
                MontoPorApropiacion: 0,
                Metas: [],
                Fuentes: [],
                Productos: []
            };

            // Busca si en Rubros ya existe el elemento que intenta agregarse, comparandolo con su id
            // si lo que devuelve filter es un arreglo mayor que 0, significa que el elemento a agregar ya existe
            // por lo tanto devuelve un mensaje de alerta
            if (self.Rubros.filter(function (element) { return element.Codigo === apropiacion.Codigo; }).length > 0) {
                swal(
                    'Apropiación ya agregada',
                    'El rubro: <b>' + Fap.Codigo + ": " + Fap.Apropiacion.Nombre + '</b> ya ha sido agregado',
                    'warning'
                );
                // Por el contrario, si el tamaño del arreglo que devuelve filter es menor a 0
                // significa que no encontró ningún elemento que coincida con el id y agrega el objeto al arreglo
            } else {
                self.Rubros.push(Fap);
            }

        };



        self.meta_necesidad = {
            Meta: self.meta,
            Actividades: self.actividades,
            MontoPorMeta: 0
        };
        self.addProductoCatalogo = function () {
            self.productos.filter(function (e) {
                return e.Id === self.producto_catalogo.Id;
            }).length > 0 || !self.producto_catalogo.Id ?
                swal({
                    type: 'error',
                    title: 'El producto ya fue agregado',
                    showConfirmButton: true,
                }) :
                self.productos.push(self.producto_catalogo);
                console.info(self.productos);
            self.producto_catalogo = {};
            self.producto_catalogo.RequisitosMinimos = [];
        }

        self.eliminarRubro = function (rubro) {
            for (var i = 0; i < self.Rubros.length; i += 1) {
                if (self.Rubros[i] === rubro) {
                    self.Rubros.splice(i, 1);
                }
            }

        };

        self.eliminarRequisito = function (requisito) {
            for (var i = 0; i < self.requisitos_minimos.length; i += 1) {
                if (self.requisitos_minimos[i] === requisito) {
                    self.requisitos_minimos.splice(i, 1);
                }
            }
        };

        self.eliminarActividad = function (actividad) {
            for (var i = 0; i < self.ActividadEspecificaNecesidad.length; i += 1) {
                if (self.ActividadEspecificaNecesidad[i] === actividad) {
                    self.ActividadEspecificaNecesidad.splice(i, 1);
                }
            }
        };

        $scope.$watch('solicitudNecesidad.Rubros', function () {
            self.Necesidad.Valor = 0;

            for (var i = 0; i < self.Rubros.length; i++) {
                self.Rubros[i].MontoPorApropiacion = 0;
                self.Rubros[i].MontoFuentes = 0;
                self.Rubros[i].MontoProductos = 0;
                self.Rubros[i].MontoMeta = 0;
                // calculo valor case inversion
                if (self.Necesidad.TipoFinanciacionNecesidadId.Nombre === 'Inversión') {
                    if (self.Rubros[i].Metas.length > 0 && self.Rubros[i].Metas[0].Actividades) {
                        self.Rubros[i].MontoPorApropiacion += self.Rubros[i].Metas[0].MontoPorMeta;
                    }
                    // if (self.Rubros[i].Apropiacion.productos !== undefined) {
                    //     for (var k = 0; k < self.Rubros[i].Apropiacion.productos.length; k++) {
                    //         self.Rubros[i].MontoProductos += self.Rubros[i].Apropiacion.productos[k].MontoParcial;
                    //     }
                    // }
                }

                // case Funcionamiento
                if (self.Necesidad.TipoFinanciacionNecesidadId.Nombre === 'Funcionamiento') {
                    if(self.Rubros[i].Fuentes.length > 0){
                        for (var index = 0; index < self.Rubros[i].Fuentes.length; index++) {
                            self.Rubros[i].MontoFuentes += self.Rubros[i].Fuentes[index].MontoParcial;
                            
                        }
                    }
                    self.Rubros[i].MontoPorApropiacion = self.Rubros[i].MontoFuentes;
                }

                self.Necesidad.Valor += self.Rubros[i].MontoPorApropiacion;
            }
        }, true);

        $scope.$watch('solicitudNecesidad.servicio_valor', function () {
            self.valor_compra_servicio = self.servicio_valor + self.valorTotalEspecificaciones;
        }, true)

        $scope.$watch('solicitudNecesidad.producto_catalogo', function () {
            self.producto_catalogo.Subtotal = (self.producto_catalogo.Valor * self.producto_catalogo.Cantidad) || 0;
            var tIva = [];
            if (self.iva_data != undefined) {
                tIva = self.iva_data.filter(function (iva) {
                    if (iva.Id === self.producto_catalogo.Iva) { return iva.Tarifa };
                })
            }

            if (tIva[0] != undefined) {
                if(tIva[0].Tarifa === 0){
                    self.producto_catalogo.ValorIVA = 0;
                    self.producto_catalogo.preciomasIVA = self.producto_catalogo.Subtotal || 0;
                }else{
                    self.producto_catalogo.ValorIVA = (self.producto_catalogo.Subtotal * (tIva[0].Tarifa / 100)) || 0;
                    self.producto_catalogo.preciomasIVA = self.producto_catalogo.Subtotal + self.producto_catalogo.ValorIVA || 0;
                }
                
            }
            
            console.info(self.producto_catalogo.preciomasIVA, "precioIVA" )
        }, true)

        $scope.$watch('solicitudNecesidad.productos', function () {
            self.valorTotalEspecificaciones = 0;
            self.subtotalEspecificaciones = 0;
            self.valorIVA = 0;
            self.productos.forEach(function (producto) {
                self.subtotalEspecificaciones += producto.Subtotal;
            });
            self.productos.forEach(function (producto) {
                self.valorIVA += producto.ValorIVA;
            });
            self.valorTotalEspecificaciones = self.valorIVA + self.subtotalEspecificaciones;
            self.valor_compra_servicio = self.servicio_valor + self.valorTotalEspecificaciones;
        }, true);

        $scope.$watch('solicitudNecesidad.Necesidad.TipoContratoNecesidadId', function () {
            if (self.Necesidad.TipoContratoNecesidadId && (self.Necesidad.TipoContratoNecesidadId.Id === 1 || self.Necesidad.TipoContratoNecesidadId.Id === 4) /* tipo compra o compra y servicio */) {
                self.MostrarTotalEspc = true;
            } else {
                self.MostrarTotalEspc = false;
            }
            //prestacion serv
            if(self.Necesidad.TipoContratoNecesidadId && self.Necesidad.TipoContratoNecesidadId.Id === 2){
                self.servicio_valor=self.Necesidad.Valor;
                self.DetallePrestacionServicioNecesidad.Cantidad=1;
            }
            // serv
            if(self.Necesidad.TipoContratoNecesidadId && self.Necesidad.TipoContratoNecesidadId.Id === 5){
                self.servicio_valor=self.Necesidad.Valor;
                self.DetalleServicioNecesidad.Valor=self.Necesidad.Valor;
            }
            // compra y serv
            if(self.Necesidad.TipoContratoNecesidadId && self.Necesidad.TipoContratoNecesidadId.Id === 4){
                self.servicio_valor=self.DetalleServicioNecesidad.Valor;
            }
            self.valorTotalEspecificaciones = 0;
            self.productos = [];
            self.requisitos_minimos = [];
        }, true);

        self.agregarActEsp = function (actividad) {
            var a = {};
            a.Descripcion = actividad;
            self.ActividadEspecificaNecesidad.push(a);
        };

        self.quitar_act_esp = function (i) {
            self.ActividadEspecifica.splice(i, 1);
        };

        self.submitForm = function (form) {
            if (form.$valid) {
                self.crear_solicitud();
            } else {
                swal(
                    'Faltan datos en el formulario',
                    'Completa todos los datos obligatorios del formulario',
                    'warning'
                ).then(function (event) {
                    var e = angular.element('.ng-invalid-required')[2];
                    e.focus(); // para que enfoque el elemento
                    e.classList.add("ng-dirty"); //para que se vea rojo
                })
            };
        };

        self.crear_solicitud = function () {
            self.ActividadEconomicaNecesidad = self.actividades_economicas_id
            self.Necesidad.ModalidadSeleccionId = { Id: 8 }
            self.Necesidad.EstadoNecesidadId = { Id: 8 }
            self.Necesidad.FechaSolicitud = new Date()
            // self.marcos_legales = self.documentos.map(function (d) { return { MarcoLegalId: d }; });
            // self.f_apropiaciones = [];
            // self.productos_apropiaciones = [];
            // self.Rubros
            //     .filter(function (fap) { return fap.fuentes !== undefined; })
            //     .forEach(function (fap) {
            //         fap.fuentes.forEach(function (fuente) {
            //             var f = {
            //                 Apropiacion: fap.Apropiacion,
            //                 MontoParcial: fuente.MontoParcial,
            //                 FuenteFinanciamiento: fuente.Codigo,
            //             };
            //             self.f_apropiaciones.push(f);
            //         });
            //         //Construye objeto relación producto-rubro para persistir
            //         if (fap.productos && fap.productos.length > 0) {
            //             fap.productos.forEach(function (producto) {
            //                 var prod = {
            //                     ProductoRubro: producto.Id,
            //                     Apropiacion: fap.Apropiacion
            //                 };
            //                 self.productos_apropiaciones.push(prod);
            //             });
            //         }
            //     });

            self.TrNecesidad = {
                Necesidad: self.Necesidad,
                DetalleServicioNecesidad: self.DetalleServicioNecesidad,
                DetallePrestacionServicioNecesidad: self.DetallePrestacionServicioNecesidad,
                ProductosCatalogoNecesidad: self.productos.map(function (p) {
                    return {
                        CatalogoId: p.Id,
                        UnidadId: p.Unidad.Id,
                        IvaId: p.Iva,
                        Cantidad: p.Cantidad,
                        Valor: p.Valor,
                        RequisitosMinimos: p.RequisitosMinimos
                    }
                }),
                MarcoLegalNecesidad: self.MarcoLegalNecesidad,
                ActividadEspecificaNecesidad: self.ActividadEspecificaNecesidad,
                ActividadEconomicaNecesidad: self.ActividadEconomicaNecesidad,
                Rubros: self.Rubros

            }


            var NecesidadHandle = function (response, type) {
                var templateAlert = "<table class='table table-bordered'><th>" +
                    $translate.instant('UNIDAD_EJECUTORA') + "</th><th>" +
                    $translate.instant('DEPENDENCIA_DESTINO') + "</th><th>" +
                    $translate.instant('TIPO_CONTRATO') + "</th><th>" +
                    $translate.instant('VALOR') + "</th>";


                self.alerta_necesidad = response.data;

                if (response.status > 300 ) {
                    swal({
                        title: 'Error Registro Necesidad',
                        type: 'error',
                        text: JSON.stringify(self.alerta_necesidad),
                        showCloseButton: true,
                        confirmButtonText: $translate.instant("CERRAR")
                    });
                    return;
                }
                if ((self.alerta_necesidad.status < 300) && self.alerta_necesidad.Body.Necesidad.Id) {
                    if (type === "post") {

                    }
                    if (type === "put") {


                    }
                }

                var forEachResponse = function (response) {
                    if (response.status > 300) {
                        templateAlert += "<tr class='danger'>";
                    } else {
                        templateAlert += "<tr class='success'>";
                    }

                    var n = typeof (response.data) === "object" ? response.data.Necesidad : self.Necesidad;

                    templateAlert +=
                        "<td>" + self.unidad_ejecutora_data.filter(function (u) { return u.Id === n.AreaFuncional; })[0].Nombre + "</td>" +
                        "<td>" + self.dependencia_data.filter(function (dd) { return dd.Id === self.dependencia_destino; })[0].Nombre + "</td>" +
                        "<td>" + (n.TipoContratoNecesidadId.Nombre ? n.TipoContratoNecesidadId.Nombre : '') + "</td>" +
                        "<td>" + $filter('currency')(n.Valor) + "</td>";

                    templateAlert += "</tr>";

                };

                forEachResponse(self.alerta_necesidad);

                templateAlert = templateAlert + "</table>";
                swal({
                    title: 'Se ha creado la necesidad exitosamente. ',
                    text: 'A continuación encontrará el resumen de los datos ingresados.',
                    type: "success",
                    width: 800,
                    html: templateAlert,
                    showCloseButton: true,
                    confirmButtonText: $translate.instant("CERRAR")
                });
                if (response.status < 300) {
                    $window.location.href = '#/necesidades';
                }
            };

            if (self.IdNecesidad) {
                if (self.TrNecesidad.Necesidad.EstadoNecesidadId.Id === necesidadService.EstadoNecesidadType.Rechazada.Id) {
                    swal(
                        'Error',
                        'La necesidad no se puede editar, estado de la necesidad: (' + self.TrNecesidad.Necesidad.EstadoNecesidadId.Nombre + ')',
                        'warning'
                    );
                    return;
                }
                self.TrNecesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.Modificada;
                planCuentasMidRequest.post('necesidad/post_full_necesidad/', self.TrNecesidad).then(function (r) {
                    NecesidadHandle(r);
                }).catch(function (e) {
                    console.info(e)
                })
            } else {
                self.TrNecesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.Guardada;
                // validacion de financiacion vs especificaciones
                var especificaciones_valido = false;
                if (self.Necesidad.TipoNecesidadId.Id === 2) {
                    especificaciones_valido = true;
                    self.ValidarFinanciacion() ? planCuentasMidRequest.post('necesidad/post_full_necesidad/', self.TrNecesidad).then(function (r) {
                        NecesidadHandle(r);
                    }).catch(function (e) {
                        console.info(e)
                    }) : _;
                    return;
                } else {


                    switch (self.Necesidad.TipoContratoNecesidadId.Id) {
                        case 1:
                            especificaciones_valido = self.Necesidad.Valor === self.valorTotalEspecificaciones
                            break;
                        case 2:
                            especificaciones_valido = self.Necesidad.Valor === self.servicio_valor;
                            break;
                        case 4:
                            especificaciones_valido = self.Necesidad.Valor === (self.valorTotalEspecificaciones + self.servicio_valor);
                            break;
                        case 5:
                            especificaciones_valido = self.Necesidad.Valor === self.servicio_valor;
                            break;
                    }

                    console.info(self.Necesidad.Valor, "Valor N", self.servicio_valor);

                    if (especificaciones_valido) {
                        planCuentasMidRequest.post('necesidad/post_full_necesidad/',self.TrNecesidad).then(function(r){
                            NecesidadHandle(r);
                        }).catch(function(e){
                            console.info(e)
                        })
                    } else {
                        swal({
                            title: 'Información incompleta',
                            type: 'error',
                            text: 'Verifique que ha ingresado la información pertinente sobre la clase de contratación ',
                            showCloseButton: true,
                            confirmButtonText: $translate.instant("CERRAR")
                        })
                    }

                }
            }
        };

        self.ValidarFinanciacion = function () {
            var fin_valid = self.Rubros.length > 0;
            self.Rubros.forEach(function (ap) {
                var v_fuentes = ap.MontoFuentes || 0;
                // CASE INVERSION
                if (self.Necesidad.TipoFinanciacionNecesidadId.Nombre === 'Inversión') {
                    fin_valid = fin_valid  && ap.MontoMeta <= ap.Apropiacion.ValorActual;
                } else {
                    //CASE FUNCIONAMIENTO
                    fin_valid = fin_valid && ap.MontoFuentes <= ap.Apropiacion.ValorActual;
                }
                ap.MontoFuentes > ap.Apropiacion.ValorActual ? swal(necesidadService.getAlertaFinanciacion(ap.Apropiacion.Codigo).fuentesMayorQueRubro) : _;

            });
            !fin_valid ? _ : swal({
                title: 'Financiación balanceada',
                type: 'success',
                text: 'Los valores de financiación están en igualdad',
                showCloseButton: true,
                confirmButtonText: $translate.instant("CERRAR")
            });
            return fin_valid;
        }

        self.ResetNecesidad = function () {
            var TipoNecesidad = self.Necesidad.TipoNecesidadId.Id;
            necesidadService.initNecesidad().then(function (trNecesidad) {
                self.necesidad = trNecesidad[0].Necesidad;
                self.necesidad_plancuentas = trNecesidad[1];
                self.necesidad.TipoNecesidad = { Id: parseInt(TipoNecesidad, 10) };
                self.CambiarTipoNecesidad(TipoNecesidad);
            });

        };

        // Control de visualizacion de los campos individuales en el formulario
        self.CambiarTipoNecesidad = function (TipoNecesidad) {
            self.forms = _.merge({}, self.estructura.init.forms);
            self.fields = _.merge({}, self.estructura.init);

            self.TipoNecesidadType = ["", "Contratacion", "", "Avances", "", "", "ServiciosPublicos"];

            _.merge(self.forms, self.estructura[self.TipoNecesidadType[TipoNecesidad]].forms);
            _.merge(self.fields, self.estructura[self.TipoNecesidadType[TipoNecesidad]]);
            self.Necesidad.TipoContratoNecesidadId = { Id: 3 }; //Tipo Contrato Necesidad: No Aplica
        };
        //control avance y retroceso en el formulario
        self.CambiarForm = function (form) {
            switch (form) {
                case 'general':
                    self.FormularioSeleccionado = 0;
                    break;
                case 'financiacion':
                    if (self.ValidarSeccion('general')) {
                        self.SeccionesFormulario.general.completado = true;
                        self.SeccionesFormulario.financiacion.activo = true;
                        self.FormularioSeleccionado = 1;
                    }
                    else {
                        self.AlertSeccion('General');
                    }
                    break;
                case 'legal':
                    if (self.ValidarSeccion('financiacion')) {
                        self.SeccionesFormulario.financiacion.completado = true;
                        self.SeccionesFormulario.legal.activo = true;
                        self.FormularioSeleccionado = 2;
                    }
                    else {
                        // self.AlertSeccion('Financiación');
                    }
                    break;
                case 'contratacion':
                    if (self.ValidarSeccion('legal')) {
                        self.SeccionesFormulario.legal.completado = true;
                        self.SeccionesFormulario.contratacion.activo = true;
                        self.FormularioSeleccionado = 3;
                    }
                    else {
                        self.AlertSeccion('Legal');
                    }
                    break;
            }
        };

        $scope.$watch('solicitudNecesidad.FormularioSeleccionado', function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }, true)

        self.ValidarSeccion = function (form) {
            var n = self.solicitudNecesidad;
            switch (form) {
                case 'general':
                    return (document.getElementById("f_general").classList.contains('ng-valid') && document.getElementById("f_general").classList.contains('ng-valid'));
                case 'financiacion':
                    var val = self.ValidarFinanciacion()
                    return val && document.getElementById("f_financiacion").classList.contains('ng-valid') && !document.getElementById("f_financiacion").classList.contains('ng-pristine');
                case 'legal':
                    return !document.getElementById("f_legal").classList.contains('ng-invalid');
                case 'contratacion':
                    return true;
            }
        };

        self.AlertSeccion = function (seccion) {
            swal({
                title: 'Sección ' + seccion + ' incompleta',
                type: 'error',
                text: 'Por favor, complete la sección: ' + seccion,
                showCloseButton: true,
                confirmButtonText: $translate.instant("CERRAR")
            });
        };




    });