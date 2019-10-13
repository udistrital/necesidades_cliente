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
    .controller('SolicitudNecesidadCtrl', function (administrativaRequest, planCuentasRequest, $scope, $sce, $http, $filter, $window, agoraRequest, parametrosGobiernoRequest, coreAmazonRequest, $translate, $routeParams, necesidadService) {
        var self = this;

        self.IdNecesidad = $routeParams.IdNecesidad;

        self.documentos = [];
        self.avance = undefined;
        self.formuIncompleto = true;


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


        self.fecha_actual = new Date();
        self.vigencia = self.fecha_actual.getFullYear();

        self.deepCopy = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };

        self.variable = {};

        self.DuracionEspecial = 'unico_pago';
        self.fecha = new Date();
        self.f_apropiacion = [];
        self.ActividadEspecifica = [];
        self.especificaciones = [];
        self.requisitos_minimos = [];
        self.actividades_economicas = [];
        self.actividades_economicas_id = [];
        self.productos = [];
        self.f_valor = 0;
        self.servicio_valor = 0;
        self.valor_compra_servicio = 0;
        self.meta_valor = 0;
        self.asd = [];
        self.valorTotalEspecificaciones = 0;
        self.subtotalEspecificaciones = 0;
        self.valorIVA = 0;
        self.FormularioSeleccionado = 0;


        self.planes_anuales = [{
            Id: 1,
            Nombre: "Plan de Adquisición 2019"
        }];

        self.duracionEspecialMap = {
            duracion: [true, false, false, undefined],
            unico_pago: [true, true, false, undefined],
            agotar_presupuesto: [true, false, true, undefined]
        };

        self.iva_data = {
          /*   iva1: {
                Id: 1,
                Valor: 16,
            },
            iva2: {
                Id: 2,
                Valor: 19,
            },
            iva3: {
                Id: 3,
                Valor: 0,
            } */
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
            self.necesidad.DiasDuracion = necesidadService.calculo_total_dias(self.anos, self.meses, self.dias);

            var s = self.duracionEspecialMap[especial];
            if (!s) { return; }

            self.ver_duracion_fecha = s[0];
            self.necesidad.UnicoPago = s[1];
            self.necesidad.AgotarPresupuesto = s[2];
            self.necesidad.DiasDuracion = s[3] === undefined ? self.necesidad.DiasDuracion : s[3];
        };

        self.duracionEspecialReverse = function () {
            var test = [self.necesidad.UnicoPago, self.necesidad.AgotarPresupuesto];
            Object.keys(self.duracionEspecialMap).forEach(function (k) {
                var v = self.duracionEspecialMap[k].slice(1, 3);
                if (_.isEqual(test, v)) {
                    self.DuracionEspecial = k;
                    self.ver_duracion_fecha = self.duracionEspecialMap[k][0];
                }
            });
        };

        necesidadService.initNecesidad(self.IdNecesidad).then(function (trNecesidad) {
            self.f_apropiacion = trNecesidad[1];
            trNecesidad = trNecesidad[0];
            self.necesidad = trNecesidad.Necesidad;
            // self.detalle_servicio_necesidad = trNecesidad.Necesidad.DetalleServicioNecesidad;
            // self.detalle_servicio_necesidad.Cantidad = 1;
            self.ActividadEspecifica = trNecesidad.Necesidad.ActividadEspecifica || [];

            if (self.necesidad.TipoContratoNecesidad.Id === 2) {
                self.actividades_economicas_id = trNecesidad.ActividadEconomicaNecesidad.map(function (d) {
                    return parseInt(d.ActividadEconomica, 10);
                });
            }

            if (trNecesidad.Ffapropiacion) {
                self.f_apropiaciones = trNecesidad.Ffapropiacion;
                self.f_apropiaciones.forEach(function (element) {
                    var cantidadFuentes = element.apropiacion.Fuentes.length;

                    for (var i = 0; i < cantidadFuentes; i += 1) {
                        element.apropiacion.Fuentes[i].FuenteFinanciamiento = apropiacion.Fuentes[i].InfoFuente;
                    }

                    self.f_apropiacion.push({
                        Codigo: element.Codigo,
                        apropiacion: element.Apropiacion,
                        // fuentes: apropiacion.Fuentes,
                        initFuentes: apropiacion.Fuentes,
                        Monto: element.Apropiacion.ApropiacionInicial,
                        productos: element.apropiacion.Productos,
                        initProductos: element.Apropiacion.Productos
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
                        self.dependencia_solicitante.JefeDependenciaSolicitante = JD.JefeDependencia.Id;
                    }).catch(function (err) {
                    }) : _;
            }, true);


            $scope.$watch('solicitudNecesidad.dependencia_destino', function () {
                self.jefe_destino = null;
                self.dependencia_destino ?
                    necesidadService.getJefeDependencia(self.dependencia_destino).then(function (JD) {
                        self.jefe_destino = JD.Persona;
                        self.dep_ned.JefeDependenciaDestino = JD.JefeDependencia.Id;
                    }).catch(function (err) {
                    }) : _;
            }, true);


            $scope.$watch('solicitudNecesidad.rol_ordenador_gasto', function () {
                self.ordenador_gasto = null;
                self.rol_ordenador_gasto ?
                    necesidadService.getJefeDependencia(self.rol_ordenador_gasto).then(function (JD) {
                        self.ordenador_gasto = JD.Persona;
                        self.dep_ned.OrdenadorGasto = parseInt(JD.Persona.Id, 10);
                    }).catch(function (err) {
                    }) : _;
            }, true);
        });

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
                form.open = false;
                return false;
            } else {
                form.open = !form.open;
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

        $scope.$watchGroup(['solicitudNecesidad.necesidad.UnidadEjecutora', 'solicitudNecesidad.necesidad.TipoFinanciacionNecesidad'], function () {
            // reset financiacion si se cambia de tipo finaciacion o unidad ejecutora
            self.f_apropiacion = [];
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
            console.info("error obteniendo lista ordenadores gasto", err);
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


        administrativaRequest.get('tipo_necesidad', $.param({
            limit: -1,
            sortby: "NumeroOrden",
            order: "asc",
        })).then(function (response) {
            self.tipo_necesidad_data = response.data;
            //ocultar terporalmente funcionalidad no implementada
            //TODO: implementar la demas funcionalidad
            // var tmpSet = [2, 4, 5] // Ocultando: Nomina, Seguridad Social, Contratacion docente
            var tmpSet = [1, 6];
            self.tipo_necesidad_data = self.tipo_necesidad_data.filter(function (tn) { return tmpSet.includes(tn.Id) })
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
            let arrJD = [];
            self.interventor_data = response.data;
            self.persona_data = response.data.filter(function (p) {
                self.jefes_dep_data.data.forEach(function(i){
                    if(p.Id == i.TerceroId){
                        arrJD.push(p);
                    }

                })
                return arrJD ;
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

        administrativaRequest.get('tipo_financiacion_necesidad', $.param({
            limit: -1
        })).then(function (response) {
            self.tipo_financiacion_data = response.data;
        });

        administrativaRequest.get('tipo_contrato_necesidad', $.param({
            limit: -1,
            query: 'Estado:true'
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
                Codigo: apropiacion.Codigo,
                MontoPorApropiacion: 0,
            };

            // Busca si en f_apropiacion ya existe el elemento que intenta agregarse, comparandolo con su id
            // si lo que devuelve filter es un arreglo mayor que 0, significa que el elemento a agregar ya existe
            // por lo tanto devuelve un mensaje de alerta
            if (self.f_apropiacion.filter(function (element) { return element.Codigo === apropiacion.Codigo; }).length > 0) {
                swal(
                    'Apropiación ya agregada',
                    'El rubro: <b>' + Fap.Codigo + ": " + Fap.Apropiacion.Nombre + '</b> ya ha sido agregado',
                    'warning'
                );
                // Por el contrario, si el tamaño del arreglo que devuelve filter es menor a 0
                // significa que no encontró ningún elemento que coincida con el id y agrega el objeto al arreglo
            } else {
                self.f_apropiacion.push(Fap);
            }

        };



        self.meta_necesidad = {
            Meta: self.meta,
            Actividades: self.actividades,
            MontoPorMeta: 0
        };


        self.eliminarRubro = function (rubro) {
            for (var i = 0; i < self.f_apropiacion.length; i += 1) {
                if (self.f_apropiacion[i] === rubro) {
                    self.f_apropiacion.splice(i, 1);
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
            for (var i = 0; i < self.ActividadEspecifica.length; i += 1) {
                if (self.ActividadEspecifica[i] === actividad) {
                    self.ActividadEspecifica.splice(i, 1);
                }
            }
        };

        $scope.$watch('solicitudNecesidad.f_apropiacion', function () {
            self.f_valor = 0;

            for (var i = 0; i < self.f_apropiacion.length; i++) {
                self.f_apropiacion[i].MontoPorApropiacion = 0;
                self.f_apropiacion[i].MontoFuentes = 0;
                self.f_apropiacion[i].MontoProductos = 0;
                if (self.necesidad.TipoFinanciacionNecesidad.Nombre === 'Inversión') {
                    if (self.f_apropiacion[i].Apropiacion.meta !== undefined && self.f_apropiacion[i].Apropiacion.meta.actividades !== undefined) {
                        for (var k = 0; k < self.f_apropiacion[i].Apropiacion.meta.actividades.length; k++) {
                            self.f_apropiacion[i].MontoPorApropiacion += self.f_apropiacion[i].Apropiacion.meta.actividades[k].MontoParcial;
                        }
                    }
                }
                if (self.f_apropiacion[i].Apropiacion.fuentes !== undefined) {
                    for (var k = 0; k < self.f_apropiacion[i].Apropiacion.fuentes.length; k++) {
                        self.f_apropiacion[i].MontoFuentes += self.f_apropiacion[i].Apropiacion.fuentes[k].MontoParcial;
                    }
                }
                if (self.f_apropiacion[i].Apropiacion.productos !== undefined) {
                    for (var k = 0; k < self.f_apropiacion[i].Apropiacion.productos.length; k++) {
                        self.f_apropiacion[i].MontoProductos += self.f_apropiacion[i].Apropiacion.productos[k].MontoParcial;
                    }
                }

                if (self.necesidad.TipoFinanciacionNecesidad.Nombre === 'Funcionamiento') {
                    self.f_apropiacion[i].MontoPorApropiacion = self.f_apropiacion[i].MontoFuentes;
                }

                self.f_valor += self.f_apropiacion[i].MontoPorApropiacion;
            }
        }, true);

        $scope.$watch('solicitudNecesidad.servicio_valor', function () {
            self.valor_compra_servicio = self.servicio_valor + self.valorTotalEspecificaciones;
        }, true)


        $scope.$watch('solicitudNecesidad.productos', function () {
            self.valorTotalEspecificaciones = 0;
            self.subtotalEspecificaciones = 0;
            self.valorIVA = 0;

            self.productos.forEach(function (pro) {
                pro.Subtotal = (pro.Valor * pro.Cantidad) || 0;
                pro.ValorIVA = (pro.Valor * (pro.Iva / 100)) || 0;
                pro.preciomasIVA = (pro.Valor * (pro.Iva / 100)) + pro.Valor || 0;
            });


            self.productos.forEach(function (producto) {
                self.subtotalEspecificaciones += (producto.Valor * producto.Cantidad);
            });
            self.productos.forEach(function (producto) {
                self.valorIVA += (producto.Valor * (producto.Iva / 100));
            });
            self.valorTotalEspecificaciones = self.valorIVA + self.subtotalEspecificaciones;
            self.valor_compra_servicio = self.servicio_valor + self.valorTotalEspecificaciones;

        }, true);

        $scope.$watch('solicitudNecesidad.necesidad.TipoContratoNecesidad', function () {
            if (self.necesidad && (self.necesidad.TipoContratoNecesidad.Id === 1 || self.necesidad.TipoContratoNecesidad.Id === 4) /* tipo compra o compra y servicio */) {
                self.MostrarTotalEspc = true;
            } else {
                self.MostrarTotalEspc = false;
            }
            self.valorTotalEspecificaciones = 0;
            self.productos = [];
            self.requisitos_minimos = [];
        }, true);

        self.agregarActEsp = function (actividad) {
            var a = {};
            a.Descripcion = actividad;
            self.ActividadEspecifica.push(a);
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
            self.actividades_economicas_id = self.actividades_economicas.map(function (ae) { return { ActividadEconomica: ae.Codigo } });
            self.marcos_legales = self.documentos.map(function (d) { return { MarcoLegal: d }; });
            self.f_apropiaciones = [];
            self.productos_apropiaciones = [];
            self.f_apropiacion
                .filter(function (fap) { return fap.fuentes !== undefined; })
                .forEach(function (fap) {
                    fap.fuentes.forEach(function (fuente) {
                        var f = {
                            Apropiacion: fap.Apropiacion,
                            MontoParcial: fuente.MontoParcial,
                            FuenteFinanciamiento: fuente.Codigo,
                        };
                        self.f_apropiaciones.push(f);
                    });
                    //Construye objeto relación producto-rubro para persistir
                    if (fap.productos && fap.productos.length > 0) {
                        fap.productos.forEach(function (producto) {
                            var prod = {
                                ProductoRubro: producto.Id,
                                Apropiacion: fap.Apropiacion
                            };
                            self.productos_apropiaciones.push(prod);
                        });
                    }
                });

            ;
            self.necesidad.Valor = self.f_valor;
            self.necesidad.ModalidadSeleccion = {
                Id: 8,
                Nombre: "Otra",
                Descripcion: "",
                CodigoAbreviacion: "",
                Estado: true,
                NumeroOrden: "8.00"
            };

            self.tr_necesidad = {
                Necesidad: self.necesidad,
                ActividadEspecifica: self.ActividadEspecifica,
                ActividadEconomicaNecesidad: self.actividades_economicas_id,
                MarcoLegalNecesidad: self.marcos_legales,
                Ffapropiacion: self.f_apropiaciones,
                MetasActs: self.meta_necesidad,
                DependenciaNecesidad: self.dep_ned,
                DetalleServicioNecesidad: self.detalle_servicio_necesidad,
                ProductosNecesidad: self.productos_apropiaciones
            };


            self.necesidad_plancuentas = {
                apropiaciones: self.f_apropiacion.map(function (ap) {
                    return {
                        codigo: ap.Apropiacion.Codigo,


                        metas: self.necesidad.TipoFinanciacionNecesidad.Nombre === 'Inversión' ? [{
                            codigo: ap.Apropiacion.meta.actividades[0].meta_id || 0,
                            actividades: ap.Apropiacion.meta.actividades.map(function (a) {
                                return {
                                    codigo: a.actividad_id,
                                    valor: a.MontoParcial
                                }
                            })
                        }
                        ] : [],

                        fuentes: ap.Apropiacion.fuentes.map(function (f) {
                            return {
                                codigo: f.Codigo,
                                valor: f.MontoParcial
                            }
                        }),

                        productos: ap.Apropiacion.productos.map(function (p) {
                            return {
                                _id: p._id,
                                valor: p.MontoParcial,
                            }
                        }),



                    }
                }),
                detalleServicio: (self.necesidad.TipoContratoNecesidad.Id === 4 || self.necesidad.TipoContratoNecesidad.Id === 5) ? {
                    valor: self.f_valor + self.servicio_valor || 0,
                    codigo: self.detalle_servicio_necesidadPC.codigo + "" || "",
                    descripcion: ""
                } : {}
            }


            var NecesidadHandle = function (response, type) {

                self.alerta_necesidad = response.data;
                if ((self.alerta_necesidad.Type === "success") && self.alerta_necesidad.Body.Necesidad.Id) {
                    if (type === "post") {
                        self.necesidad_plancuentas.IdAdministrativa = self.alerta_necesidad.Body.Necesidad.Id;
                        planCuentasRequest.post('necesidades', self.necesidad_plancuentas).then(
                            function (res) {
                            }
                        ).catch(function (err) {
                        });

                    }
                    if (type === "put") {
                        planCuentasRequest.put('necesidades', self.necesidad_plancuentas._id, self.necesidad_plancuentas).then(
                            function (res) {
                            }
                        ).catch(function (err) {
                        });

                    }
                }

                if ((response.status > 300 || self.alerta_necesidad.Type !== "success")) {
                    swal({
                        title: 'Error Registro Necesidad',
                        type: 'error',
                        text: self.alerta_necesidad,
                        showCloseButton: true,
                        confirmButtonText: $translate.instant("CERRAR")
                    });
                    return;
                }


                var templateAlert = "<table class='table table-bordered'><th>" +
                    $translate.instant('NO_NECESIDAD') + "</th><th>" +
                    $translate.instant('UNIDAD_EJECUTORA') + "</th><th>" +
                    $translate.instant('DEPENDENCIA_DESTINO') + "</th><th>" +
                    $translate.instant('TIPO_CONTRATO') + "</th><th>" +
                    $translate.instant('VALOR') + "</th>";

                var forEachResponse = function (data) {
                    if (data.Type === "error") {
                        templateAlert += "<tr class='danger'>";
                    } else {
                        templateAlert += "<tr class='" + data.Type + "'>";
                    }

                    var n = typeof (data.Body) === "object" ? data.Body.Necesidad : self.necesidad;

                    templateAlert +=
                        "<td>" + n.NumeroElaboracion + "</td>" +
                        "<td>" + self.unidad_ejecutora_data.filter(function (u) { return u.Id === n.UnidadEjecutora; })[0].Nombre + "</td>" +
                        "<td>" + self.dependencia_data.filter(function (dd) { return dd.Id === self.dependencia_destino; })[0].Nombre + "</td>" +
                        "<td>" + (n.TipoContratoNecesidad.Nombre ? n.TipoContratoNecesidad.Nombre : '') + "</td>" +
                        "<td>" + $filter('currency')(n.Valor) + "</td>";

                    templateAlert += "</tr>";

                    if (self.avance) {
                        self.avance.Necesidad = { Id: n.Id };
                        administrativaRequest.put('necesidad_proceso_externo/', self.avance.Id, self.avance);
                    }
                };

                forEachResponse(self.alerta_necesidad);

                templateAlert = templateAlert + "</table>";
                swal({
                    title: '',
                    type: self.alerta_necesidad.Type,
                    width: 800,
                    html: templateAlert,
                    showCloseButton: true,
                    confirmButtonText: $translate.instant("CERRAR")
                });
                if (self.alerta_necesidad.Type === "success") {
                    $window.location.href = '#/necesidades';
                }
            };

            if (self.IdNecesidad) {
                if (self.tr_necesidad.Necesidad.EstadoNecesidad.Id !== necesidadService.EstadoNecesidadType.Rechazada.Id) {
                    swal(
                        'Error',
                        'La necesidad no se puede editar, estado de la necesidad: (' + self.tr_necesidad.Necesidad.EstadoNecesidad.Nombre + ')',
                        'warning'
                    );
                    return;
                }
                self.tr_necesidad.Necesidad.EstadoNecesidad = necesidadService.EstadoNecesidadType.Modificada;
                administrativaRequest.put("tr_necesidad", self.IdNecesidad, self.tr_necesidad).then(NecesidadHandle("put"));
            } else {
                self.tr_necesidad.Necesidad.EstadoNecesidad = necesidadService.EstadoNecesidadType.Solicitada;
                // validacion de financiacion vs especificaciones
                var especificaciones_valido = false;

                if (self.necesidad.TipoNecesidad.Id === 6) {
                    especificaciones_valido = true;
                    self.ValidarFinanciacion() ?
                        administrativaRequest.post("tr_necesidad", self.tr_necesidad).then(function (res) {
                            NecesidadHandle(res, 'post')
                        }) : _;
                    return;
                } else {


                    switch (self.necesidad.TipoContratoNecesidad.Id) {
                        case 1:
                            especificaciones_valido = self.f_valor === self.valorTotalEspecificaciones
                            break;
                        case 2:
                            especificaciones_valido = self.f_valor === self.servicio_valor;
                            break;
                        case 4:
                            especificaciones_valido = self.f_valor === (self.valorTotalEspecificaciones + self.servicio_valor);
                            break;
                        case 5:
                            especificaciones_valido = self.f_valor === self.servicio_valor;
                            break;
                    }

                    // console.info(self.necesidad.TipoContratoNecesidad.Id, " Valor : ", self.f_valor, "Servicio", self.servicio_valor, "Especificaciones ", self.valorTotalEspecificaciones, "Result " + especificaciones_valido);

                    if (especificaciones_valido) {
                        administrativaRequest.post("tr_necesidad", self.tr_necesidad).then(function (res) {
                            NecesidadHandle(res, 'post')
                        });
                    } else {
                        swal({
                            title: 'Valores errados',
                            type: 'error',
                            text: 'Por favor, verifique la igualdad de los valores de Financiacion y de Clase de Contratación ',
                            showCloseButton: true,
                            confirmButtonText: $translate.instant("CERRAR")
                        })
                    }

                }
            }
        };

        self.ValidarFinanciacion = function () {
            var fin_valid = self.f_apropiacion.length > 0;
            self.f_apropiacion.forEach(function (ap) {
                var v_fuentes = 0;
                var v_act = 0;
                var v_productos = 0;
                ap.Apropiacion.fuentes ? ap.Apropiacion.fuentes.forEach(function (e) { v_fuentes += e.MontoParcial; }) : _;
                ap.Apropiacion.meta ? ap.Apropiacion.meta.actividades.forEach(function (e) { v_act += e.MontoParcial; }) : _;
                ap.Apropiacion.productos ? ap.Apropiacion.productos.forEach(function (e) { v_productos += e.MontoParcial }) : _;
                // console.info(self.necesidad.TipoFinanciacionNecesidad.Nombre);
                if (self.necesidad.TipoFinanciacionNecesidad.Nombre === 'Inversión') {
                    fin_valid = fin_valid && (v_fuentes === v_act && v_act === v_productos);
                } else {
                    fin_valid = fin_valid && (v_fuentes === v_productos);
                }

            });
            !fin_valid ? swal({
                title: 'Valores de financiacion errados',
                type: 'error',
                text: 'Por favor, verifique la igualdad de los valores de financiacion ',
                showCloseButton: true,
                confirmButtonText: $translate.instant("CERRAR")
            }) : swal({
                title: 'Financiación OK',
                type: 'success',
                text: 'Valores de financiación en igualdad',
                showCloseButton: true,
                confirmButtonText: $translate.instant("CERRAR")
            });
            return fin_valid;
        }

        self.ResetNecesidad = function () {
            var TipoNecesidad = self.necesidad.TipoNecesidad.Id;
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
            self.necesidad.TipoContratoNecesidad = { Id: 3 }; //Tipo Contrato Necesidad: No Aplica
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
                        self.AlertSeccion('Financiación');
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
        self.ValidarSeccion = function (form) {
            var n = self.solicitudNecesidad;
            switch (form) {
                case 'general':
                    return (document.getElementById("f_general").classList.contains('ng-valid') && document.getElementById("f_general").classList.contains('ng-valid'));
                case 'financiacion':
                    //  (document.getElementById("f_financiacion").classList.contains('ng-valid'), "ALfa", !document.getElementById("f_financiacion").classList.contains('ng-pristine'), "AFA", self.ValidarFinanciacion())
                    return document.getElementById("f_financiacion").classList.contains('ng-valid') && !document.getElementById("f_financiacion").classList.contains('ng-pristine') && self.ValidarFinanciacion();
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