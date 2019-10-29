'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadNecesidadesCtrl
 * @description
 * # NecesidadNecesidadesCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('NecesidadesCtrl', function ($scope, administrativaRequest, agoraRequest, planCuentasRequest, rolesService, necesidadService, $translate, $window, $mdDialog, gridApiService) {
        var self = this;
        self.offset = 0;
        self.rechazada = false;
        self.buttons = {
            AprobarNecesidad: true,
            RechazarNecesidad: true,
            EditarNecesidad: true,
            SolicitarCDP: true,
        };

        self.modalidadSel = {};
        self.TipoContrato = {};
        // self.unidadE = "";
        // self.unidadE = self.unidad_ejecutora_data.filter(function(a){
        //     if(a.Id === row.entity.UnidadEjecutora){
        //         return a.Nombre;
        //     }
        // });

        //permisos de los buttons segun el rol
        /*         rolesService.buttons('NecesidadesCtrl', rolesService.roles()).then(function (data) {
                    self.buttons = data;
                }); */

        self.unidad_ejecutora_data = [{ Id: 1, Nombre: 'Rector' }, { Id: 2, Nombre: 'Convenios' }];

        self.buscarUE = function(idUE) {
            self.unidad_ejecutora_data.filter(function(e){
                if (idUE === e.Id){
                    return e.Nombre;
                }else{
                    return "Rector"
                }
                
            })
        }
        self.gridOptions = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: true,
            useExternalFiltering: true,
            enableSelectAll: false,
            multiSelect: false,
            columnDefs: [{
                field: 'NumeroElaboracion',
                displayName: $translate.instant('NUMERO_ELABORACION_NECESIDAD'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.NumeroElaboracion;
                },
                width: '10%'
            },
            {
                field: 'Id',
                displayName: $translate.instant('NECESIDAD_NO'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Id;
                },
                width: '10%'
            },
            {
                field: 'Vigencia',
                displayName: $translate.instant('VIGENCIA'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Vigencia;
                },
                width: '5%'
            },
            // {
            //     field: 'Objeto',
            //     displayName: $translate.instant('OBJETO_CONTRACTUAL'),
            //     headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            //     cellTooltip: function (row) {
            //         return row.entity.Objeto;
            //     },
            //     width: '35%'
            // },
            // {
            //     field: 'Justificacion',
            //     displayName: $translate.instant('JUSTIFICACION_CONTRATO'),
            //     headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            //     cellTooltip: function (row) {
            //         return row.entity.Justificacion;
            //     },
            //     width: '25%'
            // },
            {
                field: "self.buscarUE(1)",
                displayName: $translate.instant('UNIDAD_EJECUTORA'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    if(row.entity.UnidadEjecutora === 1){
                        return "Rector";
                    } else{ 
                        return "Convenios";
                    }
                    
                },
                filter: { 
                    options: [{ UnidadEjecutora: 1, Nombre: 'Rector' }, { UnidadEjecutora: 2, Nombre: 'Convenios' }]     // custom attribute that goes with custom directive above 
                  }, 
                width: '15%'
            },
            {
                field: 'EstadoNecesidad.Nombre',
                displayName: $translate.instant('ESTADO'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.EstadoNecesidad.Nombre + ".\n" + row.entity.EstadoNecesidad.Descripcion;
                },
                width: '20%'
            },
            {
                field: 'TipoNecesidad.Nombre',
                displayName: $translate.instant('TIPO_NECESIDAD'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Vigencia;
                },
                width: '20%'
            },
            {
                field: 'ver',
                enableFiltering: false,
                enableSorting: false,
                displayName: $translate.instant('VER'),
                cellTemplate: function () {
                    return '<div class="col-md-3"></div><div class="col-md-2"><a href="" style="border:0; text-align: center; display: inline-block;" type="button" ng-click="grid.appScope.direccionar(row.entity)"><span class="fa fa-check-square faa-shake animated-hover"></span></a></div><div class="col-md-3"></div>';
                },
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.EstadoNecesidad.Nombre + ".\n" + row.entity.EstadoNecesidad.Descripcion;
                },
                width: '20%'
            }
            ],
            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                self.gridApi = gridApiService.pagination(self.gridApi, self.cargarDatosNecesidades, $scope);
                self.gridApi = gridApiService.filter(self.gridApi, self.cargarDatosNecesidades, $scope);

                self.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    self.necesidad = row.entity;
                    necesidadService.initNecesidad(row.entity.Id)
                });
            }
        };

        $scope.$watch('necesidades.modalidadSel', function () {

        })

        //Funcion para cargar los datos de las necesidades creadas y almacenadas dentro del sistema
        self.cargarDatosNecesidades = function (offset, query) {
            if (query === undefined) { query = []; }
            query = typeof (query) === "string" ? [query] : query;
            query.push("EstadoNecesidad.Nombre__not_in:Borrador");

            var req = administrativaRequest.get('necesidad', $.param({
                limit: self.gridOptions.paginationPageSize,
                offset: offset,
                sortby: "Vigencia,NumeroElaboracion",
                order: "desc",
                query: query.join(",")
            }, true));
            // req.data.forEach(function(n){
            //   if(n.UnidadEjecutora === 1){
            //             n.UniE= "Rector";
            //         } else{ 
            //             n.UniE= "Convenios";
            //         }
            // });

            req.then(gridApiService.paginationFunc(self.gridOptions, offset));
            return req;
        };

        self.cargarDatosNecesidades(self.offset, self.query);

        $scope.direccionar = function (necesidad) {
            self.g_necesidad = necesidad;
            self.numero_el = necesidad.NumeroElaboracion;
            self.vigencia = necesidad.Vigencia;
            self.modalidadSel = necesidad.ModalidadSeleccion;

            //para mostrar informacion de rechazo


            // validaciones para los botones: (estado) && (permisos rol)
            var aproOrRech = [necesidadService.EstadoNecesidadType.Solicitada.Id, necesidadService.EstadoNecesidadType.Modificada.Id]
                .includes(necesidad.EstadoNecesidad.Id);

            self.verBotonAprobarNecesidad = aproOrRech && self.buttons.AprobarNecesidad;
            self.verBotonRechazarNecesidad = aproOrRech && self.buttons.RechazarNecesidad;
            self.verBotonEditarNecesidad = (necesidadService.EstadoNecesidadType.Rechazada.Id === necesidad.EstadoNecesidad.Id || necesidadService.EstadoNecesidadType.Solicitada.Id === necesidad.EstadoNecesidad.Id) && necesidadService.EstadoNecesidadType.Solicitada.Id === necesidad.EstadoNecesidad.Id && self.buttons.EditarNecesidad;
            self.verBotonSolicidadCDPNecesidad = necesidadService.EstadoNecesidadType.Aprobada.Id === necesidad.EstadoNecesidad.Id && self.buttons.SolicitarCDP;

            $("#myModal").modal();

        };

        self.aprobar_necesidad = function () {
            var nec_apro = {};
            var tipoC = {};
            administrativaRequest.get('necesidad/' + self.g_necesidad.Id
            ).then(function (response) {
                nec_apro = response.data === undefined ? {} : response.data;
                nec_apro.EstadoNecesidad = necesidadService.EstadoNecesidadType.Aprobada;
                nec_apro.ModalidadSeleccion = self.modalidadSel;
                tipoC = self.TipoContrato;
                administrativaRequest.put('necesidad', nec_apro.Id, nec_apro).then(function (response) {
                    planCuentasRequest.get('necesidades', $.param({
                        query: "idAdministrativa:" + nec_apro.Id,
                    })).then(function (responseMongo) {
                        var npc = responseMongo.data.Body[0] || {};
                        npc.tipoContrato = self.TipoContrato.Id;
                        planCuentasRequest.put('necesidades', npc._id, npc).then(function (r) {
                        }).catch(function (err) {
                            nec_apro.EstadoNecesidad = necesidadService.EstadoNecesidadType.Solicitada;
                            administrativaRequest.put('necesidad', nec_apro.Id, nec_apro).then(function (response) {
                            });
                        });
                    });
                    self.alerta = "";
                    for (var i = 1; i < response.data.length; i += 1) {
                        self.alerta = self.alerta + response.data[i] + "\n";
                    }
                    swal("", self.alerta, response.data[0]);

                    self.cargarDatosNecesidades(self.offset, self.query);
                    $("#myModal").modal("hide");
                    self.g_necesidad = undefined;
                });
            });
        };

        self.rechazar_necesidad = function () {
            var nec_rech = {};
            swal({
                title: 'Indica una justificación por el rechazo',
                input: 'textarea',
                showCancelButton: true,
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value) {
                            resolve();
                        } else {
                            reject('Por favor indica una justificación!');
                        }
                    });
                }
            }).then(function (text) {
                nec_rech = {
                    Justificacion: text,
                    Necesidad: {}
                };
                return administrativaRequest.get('necesidad/' + self.g_necesidad.Id);
            }).then(function (response) {
                nec_rech.Necesidad = response.data;

                if (nec_rech.Necesidad.EstadoNecesidad.Id === necesidadService.EstadoNecesidadType.Solicitada.Id) {
                    nec_rech.Necesidad.EstadoNecesidad = necesidadService.EstadoNecesidadType.Rechazada;
                } else if (nec_rech.Necesidad.EstadoNecesidad.Id === necesidadService.EstadoNecesidadType.Modificada.Id) {
                    nec_rech.Necesidad.EstadoNecesidad = necesidadService.EstadoNecesidadType.Anulada;
                }

                return administrativaRequest.put('necesidad', nec_rech.Necesidad.Id, nec_rech.Necesidad);
            }).then(function () {
                return administrativaRequest.post('necesidad_rechazada', nec_rech);
            }).then(function (response) {
                if (response.data !== undefined) {
                    swal(
                        $translate.instant("OK"),
                        $translate.instant("NECESIDAD_RECHAZADA"),
                        'success'
                    );
                } else {
                    swal(
                        $translate.instant("ERROR"),
                        $translate.instant("NECESIDAD_NO_RECHAZADA"),
                        'error'
                    );
                }
                self.cargarDatosNecesidades(self.offset, self.query);
                self.g_necesidad = undefined;
                $("#myModal").modal("hide");
            });
        };

        administrativaRequest.get('modalidad_seleccion', $.param({
            limit: -1,
            sortby: "NumeroOrden",
            order: "asc",
        })).then(function (response) {
            self.modalidad_data = response.data;

        });

        agoraRequest.get('tipo_contrato', $.param({
            limit: -1,
            sortby: "Id",
            order: "asc",
        })).then(function (response) {
            self.tipo_contrato_data = response.data;

        });

        self.editar_necesidad = function () {
            var idNecesidad = self.g_necesidad.Id;
            $("#myModal").modal("hide");
            $('#myModal').on('hidden.bs.modal', function () {
                $window.location.href = '#/necesidad/solicitud_necesidad/' + idNecesidad;
            });
        };

        self.solicitar_cdp = function () {
            self.sol_cdp = {};
            self.sol_cdp.Necesidad = self.g_necesidad;
            var sol_cdp_pc = {
                consecutivo: 16,
                entidad: self.g_necesidad.UnidadEjecutora,
                centroGestor: 1,
                necesidad: self.g_necesidad.Id,
                vigencia: self.g_necesidad.Vigencia,
                fechaRegistro: new Date().toISOString(),
                estado: 1,
                justificacionRechazo: "",
                infoCdp: null,
                activo: true,
                fechaCreacion: new Date().toISOString(),
                fechaModificacion: new Date().toISOString(),
            };

            Promise.all([administrativaRequest.post("solicitud_disponibilidad", self.sol_cdp), planCuentasRequest.post("solicitudesCDP", sol_cdp_pc)]).then(
                function (response) {
                    self.alerta = "";
                    for (var i = 1; i < response[0].data.length; i += 1) {
                        self.alerta = self.alerta + response[0].data[i] + "\n";
                    }
                    swal("", self.alerta, response[0].data[0]);
                    swal("", self.alerta, response[1].data);
                    self.cargarDatosNecesidades(self.offset, self.query);
                    self.necesidad = undefined;
                    $("#myModal").modal("hide");
                });
        };

        $scope.crearPDF = function (row) {
            var IdNecesidad = row.Id;

            $mdDialog.show({
                templateUrl: 'views/necesidad/pdfnecesidad.html',
                controller: 'PdfnecesidadCtrl',
                controllerAs: 'necesidadPdf',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                scope: { IdNecesidad: IdNecesidad }
            });
        };

    });
