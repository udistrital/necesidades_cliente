'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadNecesidadesCtrl
 * @description
 * # NecesidadNecesidadesCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('NecesidadesCtrl', function ($scope, administrativaRequest, planCuentasMidRequest, agoraRequest, planCuentasRequest, rolesService, necesidadService, $translate, $window, $mdDialog, gridApiService, necesidadesCrudRequest) {
        var self = this;
        self.offset = 0;
        self.rechazada = false;
        self.buttons = {
            AprobarSolicitud: true,
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

        self.buscarUE = function (idUE) {
            self.unidad_ejecutora_data.filter(function (e) {
                if (idUE === e.Id) {
                    return e.Nombre;
                } else {
                    return "Rector";
                }

            });
        };
        self.gridOptions = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: true,
            columnDefs: [{
                field: 'ConsecutivoSolicitud',
                displayName: $translate.instant('NUMERO_SOLICITUD_COMPACTO'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.ConsecutivoSolicitud;
                },
                width: '10%'
            },
            {
                field: 'ConsecutivoNecesidad',
                displayName: $translate.instant('NUMERO_NECESIDAD_COMPACTO'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.ConsecutivoNecesidad;
                },
                width: '10%'
            },
            {
                field: 'Id',
                displayName: $translate.instant('NECESIDAD_NO'),
                type: 'number',
                visible: false,
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Id;
                },
                width: '15%'
            },
            {
                field: 'Vigencia',
                displayName: $translate.instant('VIGENCIA'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Vigencia;
                },
                width: '10%'
            },
            {
                field: 'EstadoNecesidadId.Nombre',
                displayName: $translate.instant('ESTADO'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.EstadoNecesidadId.Nombre + ".\n" + row.entity.EstadoNecesidadId.Descripcion;
                },
                width: '20%'
            },
            {
                field: 'TipoNecesidadId.Nombre',
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
            }],
            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                self.gridApi = gridApiService.pagination(self.gridApi, self.cargarDatosNecesidades, $scope);
                self.gridApi = gridApiService.filter(self.gridApi, self.cargarDatosNecesidades, $scope);

                self.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    necesidadService.getFullNecesidad(row.entity.Id).then(function (response) {
                        if (response.status === 200) {
                            self.necesidad = response.data.Body;
                        }
                    });
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

            var req = necesidadesCrudRequest.get('necesidad', $.param({
                limit: self.gridOptions.paginationPageSize,
                offset: offset,
                sortby: "Vigencia",
                order: "desc"
            }, true));

            req.then(gridApiService.paginationFunc(self.gridOptions, offset));
            return req;
        };

        self.cargarDatosNecesidades(self.offset, self.query);

        $scope.direccionar = function (necesidad) {
            necesidadService.getFullNecesidad(necesidad.Id).then(function (response) {
                if (response.status === 200) {
                    self.necesidad = response.data.Body;
                }


                self.g_necesidad = necesidad;
                self.numero_el = necesidad.NumeroElaboracion;
                self.vigencia = necesidad.Vigencia;
                self.modalidadSel = necesidad.ModalidadSeleccion;

                //para mostrar informacion de rechazo


                // validaciones para los botones: (estado) && (permisos rol)
                var aproOrRech = [necesidadService.EstadoNecesidadType.Solicitada.Id, necesidadService.EstadoNecesidadType.Modificada.Id,]
                    .includes(necesidad.EstadoNecesidadId.Id);

                self.verBotonAprobarSolicitud = necesidadService.EstadoNecesidadType.Guardada.Id === necesidad.EstadoNecesidadId.Id; // Cuando este Guardada (Borrador)
                self.verBotonAprobarNecesidad = aproOrRech && self.buttons.AprobarNecesidad;
                self.verBotonRechazarNecesidad = aproOrRech && self.buttons.RechazarNecesidad;
                self.verBotonEditarNecesidad = necesidadService.EstadoNecesidadType.Rechazada.Id === necesidad.EstadoNecesidadId.Id ||  necesidadService.EstadoNecesidadType.Guardada.Id === necesidad.EstadoNecesidadId.Id ||  necesidadService.EstadoNecesidadType.Modificada.Id === necesidad.EstadoNecesidadId.Id && self.buttons.EditarNecesidad;
                self.verBotonSolicidadCDPNecesidad = necesidadService.EstadoNecesidadType.Aprobada.Id === necesidad.EstadoNecesidadId.Id && self.buttons.SolicitarCDP;

                $("#myModal").modal();
            });
        };

        self.aprobar_solicitud = function () {
            self.necesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.Solicitada;
            necesidadesCrudRequest.put('necesidad', self.necesidad.Necesidad.Id, self.necesidad.Necesidad).then(function (l) {
                if (l.data !== undefined) {
                    swal(
                        $translate.instant("OK"),
                        $translate.instant("NECESIDAD_SOLICITADA"),
                        'success'
                    );
                    self.cargarDatosNecesidades(self.offset, self.query);
                    $("#myModal").modal("hide");
                } else {
                    swal(
                        $translate.instant("ERROR"),
                        $translate.instant("NECESIDAD_NO_SOLICITADA"),
                        'error'
                    );
                }
            });
        };


        self.aprobar_necesidad = function () {
            self.necesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.Aprobada;
            self.necesidad.Necesidad.ModalidadSeleccionId = self.modalidadSel;
            self.necesidad.Necesidad.TipoContratoId = self.TipoContrato.Id;

            necesidadesCrudRequest.put('necesidad', self.necesidad.Necesidad.Id, self.necesidad.Necesidad).then(function (l) {
                if (l.data !== undefined) {
                    swal(
                        $translate.instant("OK"),
                        $translate.instant("NECESIDAD_APROBADA"),
                        'success'
                    );
                    self.cargarDatosNecesidades(self.offset, self.query);
                    $("#myModal").modal("hide");
                } else {
                    swal(
                        $translate.instant("ERROR"),
                        $translate.instant("NECESIDAD_NO_APROBADA"),
                        'error'
                    );
                }
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
                        if (value && value !== "") {
                            resolve();
                        } else {
                            reject('Por favor indica una justificación!');
                        }
                    });
                }
            }).then(function (text) {
                nec_rech = {
                    Justificacion: text,
                    NecesidadId: { Id: self.necesidad.Necesidad.Id },
                    FechaRechazo: new Date()
                };

            }).then(function () {
                if (self.necesidad.Necesidad.EstadoNecesidadId.Id === necesidadService.EstadoNecesidadType.Solicitada.Id) {
                    self.necesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.Rechazada;
                } else if (self.necesidad.Necesidad.EstadoNecesidadId.Id === necesidadService.EstadoNecesidadType.Modificada.Id) {
                    self.necesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.Anulada;
                }


            }).then(function () {
                return necesidadesCrudRequest.post('necesidad_rechazada', nec_rech);
            }).then(function (response) {
                if (response.status === 200 || response.status === 201) {
                    swal(
                        $translate.instant("OK"),
                        $translate.instant("NECESIDAD_RECHAZADA"),
                        'success'
                    );
                    necesidadesCrudRequest.put('necesidad', self.necesidad.Necesidad.Id, self.necesidad.Necesidad);
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

        necesidadesCrudRequest.get('modalidad_seleccion', $.param({
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
            planCuentasMidRequest.post("cdp/solicitarCDP", self.necesidad.Necesidad).then(
                function (response) {
                    if (response.status === 200 || response.status === 201) {
                        self.necesidad.Necesidad.EstadoNecesidadId = necesidadService.EstadoNecesidadType.CdpSolicitado;
                        necesidadesCrudRequest.put('necesidad', self.necesidad.Necesidad.Id, self.necesidad.Necesidad).then(function (resp_nececesidad) {
                            if (resp_nececesidad.status === 200 || resp_nececesidad.status === 201) {
                                swal(
                                    $translate.instant("OK"),
                                    $translate.instant("CDP_SOLICITADO"),
                                    'success'
                                );
                                self.cargarDatosNecesidades(self.offset, self.query);
                                self.necesidad = undefined;
                                $("#myModal").modal("hide");
                            } else {
                                swal(
                                    $translate.instant("ERROR"),
                                    $translate.instant("CDP_NO_SOLICITADO"),
                                    'error'
                                );
                            }

                        });
                    } else {
                        swal(
                            $translate.instant("ERROR"),
                            $translate.instant("CDP_NO_SOLICITADO"),
                            'error'
                        );
                    }

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
