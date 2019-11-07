'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CdpCdpConsultaCtrl
 * @description
 * # CdpCdpConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('contractualClienteApp')
    .factory("disponibilidad", function() {
        return {};
    })
    .controller('CdpCdpConsultaCtrl', function($location,$filter, $window, $scope, $translate, disponibilidad, financieraRequest, financieraMidRequest, agoraRequest, gridApiService) {
        var self = this;
        self.offset = 0;
        self.cargando = false;
        self.hayData = true;
        self.ver_boton_reservas = true;
        self.reservas = false;
        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
          { clase_color: "ver", clase_css: "fa fa-file-excel-o fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.ANULAR'), operacion: 'anular', estado: true },

        ];

        self.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 10,
            useExternalPagination: true,
            columnDefs: [
                {
                  field: 'Id',
                  visible: false
                },
                {
                  field: 'Vigencia',
                  cellClass: 'input_center',
                  displayName: $translate.instant('VIGENCIA'),
                  headerCellClass: 'encabezado',
                  enableFiltering: false ,
                  width: '7%'
                },
                {
                  field: 'NumeroDisponibilidad',
                  displayName: $translate.instant('NO'),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado',
                  width: '7%'
                },
                {
                  field: 'DisponibilidadProcesoExterno[0].TipoDisponibilidad.Nombre',
                  displayName: $translate.instant("TIPO"),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado',
                  width: '16%'
                },
                {
                  field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Numero',
                  displayName: $translate.instant('NECESIDAD_NO'),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado' ,
                  enableFiltering: false,
                  width: '10%'
                },
                {
                  field: 'FechaRegistro',
                  displayName: $translate.instant('FECHA_REGISTRO'),
                  cellClass: 'input_center',
                  cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
                  headerCellClass: 'encabezado',
                  width: '15%'
                },
                {
                  field: 'Estado.Nombre',
                  displayName: $translate.instant('ESTADO'),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado',
                  width: '20%'
                },
                {
                  field: 'Solicitud.DependenciaSolicitante.Nombre',
                  displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado',
                  enableFiltering: false,
                  width: '15%'
                 },
                {
                    field: 'Opciones',
                    cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
                    headerCellClass: 'encabezado',
                    enableFiltering: false,
                    width: '10%'
                }
            ],
            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                self.gridApi = gridApiService.pagination(self.gridApi, self.actualizarLista, $scope);
            }

        };

        self.UnidadEjecutora = 1;
        self.gridOptions_rubros = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [
                { field: 'Id', visible: false },
                { field: 'Apropiacion.Rubro.Codigo', displayName: $translate.instant("CODIGO") },
                { field: 'Apropiacion.Rubro.Descripcion', displayName: $translate.instant("DESCRIPCION") },
                { field: 'Apropiacion.Rubro.Estado', displayName: $translate.instant("ESTADO") },
                { field: 'Valor', cellFilter: 'currency', displayName: $translate.instant("VALOR") },
                { field: 'Saldo', cellFilter: 'currency', displayName: $translate.instant("SALDO") }
            ]
        };

        financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
            .then(function(response) { //error con el success
                self.vigenciaActual = parseInt(response.data, 10);
                var dif = self.vigenciaActual - 1995;
                var range = [];
                range.push(self.vigenciaActual);
                for (var i = 1; i < dif; i += 1) {
                    range.push(self.vigenciaActual - i);
                }
                self.years = range;
                    self.Vigencia = self.vigenciaActual;

                    financieraRequest.get("disponibilidad/TotalDisponibilidades/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                        .then(function(response) { //error con el success
                            self.gridOptions.totalItems = response.data;
                            //self.filtroExterno();
                            //self.actualizarLista(self.offset, '');
                        });

            });

        self.gridOptions.multiSelect = false;

        $scope.loadrow = function(row, operacion) {
          self.operacion = operacion;
          switch (operacion) {
                case "ver":
                      self.verDisponibilidad(row,false);
                break;

                case "anular":
                      self.verDisponibilidad(row,true);
                break;
              default:
          }
      };

        self.actualizarLista = function(offset, query) {

            financieraMidRequest.cancel();
            self.gridOptions.data = [];
            self.cargando = true;
            self.hayData = true;


            if($location.search().vigencia !== undefined && $location.search().numero){
                query = '&query=NumeroDisponibilidad:'+$location.search().numero;

                financieraMidRequest.get('disponibilidad/ListaDisponibilidades/' + $location.search().vigencia, 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query + "&UnidadEjecutora=" + self.UnidadEjecutora).then(function(response) {

                    if (response.data.Type !== undefined) {

                       self.hayData = false;
                       self.cargando = false;
                        self.gridOptions.data = [];
                    } else {


                        self.hayData = true;
                        self.cargando = false;
                        self.gridOptions.data = response.data;
                    }
                });
            }else{

                financieraMidRequest.get('disponibilidad/ListaDisponibilidades/' + self.Vigencia, 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query + "&UnidadEjecutora=" + self.UnidadEjecutora).then(function(response) {

                    if (response.data.Type !== undefined) {

                      self.hayData = false;
                      self.cargando = false;
                        self.gridOptions.data = [];
                    } else {

                      self.hayData = true;
                      self.cargando = false;
                      self.gridOptions.data = response.data;
                    }
                });
            }

        };

        self.verDisponibilidad = function(row, anular) {
            self.anular = anular;
            if (self.anular){
                self.cargarTipoAnulacion();
            }
            $("#myModal").modal();
            $scope.apropiacion = undefined;
            $scope.apropiaciones = [];
            self.cdp = row.entity;
            financieraRequest.get('disponibilidad_apropiacion', 'limit=0&query=Disponibilidad.Id:' + row.entity.Id).then(function(response) {
                self.gridOptions_rubros.data = response.data;
                angular.forEach(self.gridOptions_rubros.data, function(data) {
                    if ($scope.apropiaciones.indexOf(data.Apropiacion.Id) === -1) {
                      $scope.apropiaciones.push(data.Apropiacion.Id);
                    } 

                    var rp = {
                        Disponibilidad: data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                        Apropiacion: data.Apropiacion
                    };
                    financieraRequest.post('disponibilidad/SaldoCdp', rp).then(function(response) {
                        data.Saldo = response.data;
                    });

                });

                agoraRequest.get('informacion_persona_natural', $.param({
                    query: "Id:" + self.cdp.Responsable,
                    limit: 1
                })).then(function(response) {
                    if (response.data !== null) {
                        self.cdp.Responsable = response.data[0];
                    }

                });

            });
        };

        self.limpiar = function() {

            self.motivo = undefined;
            self.Valor = undefined;
            self.Rubro_sel = undefined;
            self.alerta = "";
        };

        self.cargarTipoAnulacion = function(){
            financieraRequest.get("tipo_anulacion_presupuestal/", 'limt=-1') //formato de entrada  https://golang.org/src/time/format.go
                    .then(function(response) { //error con el success
                        self.tiposAnulacion = response.data;
                    });
        };

        self.anularDisponibilidad = function() {

            if (self.motivo === undefined || self.motivo === "" || self.motivo === null) {
                swal("", $translate.instant("E_A02"), "error");
            } else if (self.tipoAnulacion === undefined || self.tipoAnulacion === "" || self.tipoAnulacion === null) {
                swal("", $translate.instant("E_A03"), "error");
            } else if ((self.Rubro_sel === undefined || self.Rubro_sel === "" || self.Rubro_sel === null) && (self.tipoAnulacion.Nombre === "Parcial")) {
                swal("", $translate.instant("E_A05"), "error");
            } else if ((self.Valor === undefined || self.Valor === "" || self.Valor === null) && (self.tipoAnulacion.Nombre === "Parcial")) {
                swal("", $translate.instant("E_A04"), "error");
            } else if (parseFloat(self.Valor) <= 0) {
                swal("", $translate.instant("E_A07"), "error");
            } else {
                var valor = 0;
                self.alerta = "<ol>";
                var disponibilidad_apropiacion = [];
                var anulacion = {
                    Motivo: self.motivo,
                    TipoAnulacion: self.tipoAnulacion,
                    EstadoAnulacion: { Id: 1 },
                    Expidio: 1234567890
                };
                if (self.tipoAnulacion.Id === 2 || self.tipoAnulacion.Id === 3) {
                    disponibilidad_apropiacion = self.rubros_afectados;
                } else if (self.tipoAnulacion.Id === 1) {
                    disponibilidad_apropiacion[0] = self.Rubro_sel;
                    valor = parseFloat(self.Valor);
                }
                var datos_anulacion = {
                    Anulacion: anulacion,
                    Disponibilidad_apropiacion: disponibilidad_apropiacion,
                    Valor: valor
                };
                financieraRequest.post('disponibilidad/Anular', datos_anulacion).then(function(response) {
                    self.alerta_anulacion_cdp = response.data;
                    angular.forEach(self.alerta_anulacion_cdp, function(data) {
                        if (data !== "error" && data !== "success") {
                            self.alerta = self.alerta + "<li>" + data + "</li>";
                        }


                    });

                    self.alerta = self.alerta + "</ol>";
                    swal("", self.alerta, self.alerta_anulacion_cdp[0]).then(function() {

                        self.limpiar();
                        if(self.alerta_anulacion_cdp[0] === "success"){
                            $("#myModal").modal("hide");
                        }

                    });
                });
            }


        };

        self.filtrarListaCdp = function() {
            self.gridOptions.data = {};
            var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
            var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
            var query = '';
            if (inicio !== undefined && fin !== undefined) {

                  query = 'rangoinicio=' + inicio + "&rangofin=" + fin;
            }


            financieraRequest.get("disponibilidad/TotalDisponibilidades/" + self.Vigencia, query + "&UnidadEjecutora=" + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) { //error con el success
                    self.gridOptions.totalItems = response.data;
                    self.actualizarLista(0, "&" + query);
                });


        };

        $scope.$watch("cdpConsulta.Vigencia", function() {

                if(self.reservas !== true){
                  self.ver_titulo_reservas = false;
                  self.ver_boton_reservas = true;
                  self.reservas = false;
                }
                else{
                  self.ver_titulo_reservas = true;
                  self.ver_boton_reservas = false;
                  self.reservas = false;
                }

                financieraRequest.get("disponibilidad/TotalDisponibilidades/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                    .then(function(response) { //error con el success
                        self.gridOptions.totalItems = response.data;
                        self.actualizarLista(0, '');

                    });
                if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
                    //console.log(self.nuevo_calendario.FechaInicio.getFullYear());

                    self.fechaInicio = undefined;
                    self.fechaFin = undefined;
                }
                self.fechamin = new Date(
                    self.Vigencia,
                    0, 1
                );
                self.fechamax = new Date(
                    self.Vigencia,
                    12, 0
                );

        }, true);


        /*self.gridOptions.onRegisterApi = function(gridApi) {
            gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                var query = '';
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                    }
                });
                self.actualizarLista(self.offset, query);
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

                //self.gridOptions.data = {};

                var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
                var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
                var query = '';
                if (inicio !== undefined && fin !== undefined) {
                    query = '&rangoinicio=' + inicio + "&rangofin=" + fin;
                }
                var grid = this.grid;
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                    }
                });
                self.offset = (newPage - 1) * pageSize;
                self.actualizarLista(self.offset, query);
            });
            self.gridApi = gridApi;
        };
        self.gridOptions_rubros.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            self.gridApi_rubros = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.apropiacion = row.entity;
                console.log(row.entity);
                $scope.apropiacion_id = row.entity.Apropiacion.Id;
            });
            self.gridApi = gridApi;
        };*/

         self.verReservas = function() {

            financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) {
                    self.Vigencia = parseInt(response.data, 10)-1;
                    self.reservas = true;
                    self.ver_boton_reservas = false;
                });


        };

        self.volver_a_vigencia = function(){

            self.Vigencia = self.vigenciaActual;
            self.ver_boton_reservas = true;
            self.actualizarLista(0, '');
        };

    });
