'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CdpCdpSolicitudConsultaCtrl
 * @description
 * # CdpCdpSolicitudConsultaCtrl
 * Controller of the financieraClienteApp
 */

angular.module('contractualClienteApp')
.factory("solicitud_disponibilidad",function(){
        return {};
  })
  .controller('CdpCdpSolicitudConsultaCtrl', function ($scope,$filter,administrativaRequest,solicitud_disponibilidad,financieraRequest,financieraMidRequest, $translate) {
    var self = this;
    self.alerta = "";
    self.cargando = false;
    self.hayData = true;
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    self.gridOptions = {
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering : true,
      paginationPageSizes: [20, 50, 100],
      paginationPageSize: 10,
      useExternalPagination: true,
      columnDefs : [
        {
          field: 'SolicitudDisponibilidad.Id',
          visible : false
        },
        {
          field: 'SolicitudDisponibilidad.Vigencia',
          displayName: $translate.instant("VIGENCIA"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
           width: '10%',
        },
        {
          field: 'SolicitudDisponibilidad.Numero',
          displayName: $translate.instant("NO"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          width: '10%',
        },
        {
          field: 'DependenciaSolicitante.Nombre',
          displayName: $translate.instant("DEPENDENCIA_SOLICITANTE"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          enableFiltering : false,
          width: '28%',
        },
        {
          field: 'DependenciaDestino.Nombre',
          displayName: $translate.instant("DEPENDENCIA_DESTINO"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          enableFiltering : false,
          width: '28%',
        },
        {
          field: 'SolicitudDisponibilidad.FechaSolicitud',
          displayName: $translate.instant("FECHA_REGISTRO") ,
          cellClass: 'input_center',
          cellTemplate: '<span>{{row.entity.SolicitudDisponibilidad.FechaSolicitud | date:"yyyy-MM-dd":"UTF"}}</span>',
          headerCellClass: 'encabezado',
          width: '14%',
        },
        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '10%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'text-info'
      }
      ]
    };
    self.gridOptions.onRegisterApi = function(gridApi) {

            self.gridApi = gridApi;
            self.gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                var query = '';
                angular.forEach(grid.columns, function(value) {
                    if (value.filters[0].term) {

                        var formtstr = value.colDef.name.replace('[0]','');
                        if (query === ''){
                          query = formtstr + '__icontains:' + value.filters[0].term ;
                        }else{
                          query = query+','+formtstr + '__icontains:' + value.filters[0].term ;
                        }
                    }
                });
                self.offset=0;
                self.cargarDatos(self.offset,query);
            });
            self.gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

                //self.gridOptions.data = {};

                var query = '';
                var grid = this.grid;
                angular.forEach(grid.columns, function(value) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        if (query === ''){
                          query = formtstr + '__icontains:' + value.filters[0].term ;
                        }else{
                          query = query+','+formtstr + '__icontains:' + value.filters[0].term ;
                        }

                    }
                });
                self.offset = (newPage - 1) * pageSize;
                self.cargarDatos(self.offset,query);
            });
            self.gridOptions.totalItems = 50000;
};
    self.UnidadEjecutora = 1;
    financieraRequest.get("orden_pago/FechaActual/2006",'') //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.vigenciaActual = parseInt(response.data);
      var dif = self.vigenciaActual - 1995 ;
      var range = [];
      range.push(self.vigenciaActual);
      for(var i=1;i<dif;i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = self.vigenciaActual;
      self.gridOptions.totalItems = 5000;
      self.fechamin = new Date(
        self.vigenciaActual,
        0, 1
      );
      self.fechamax = new Date(
        self.vigenciaActual,
        12, 0
      );
    });


    $scope.loadrow = function(row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
          case "ver":
          $("#myModal").modal();
          $scope.apropiacion= undefined;
            $scope.apropiaciones = [];
            self.data = null;
            self.data = row.entity;

          administrativaRequest.get('fuente_financiacion_rubro_necesidad','query=Necesidad.Id:'+self.data.SolicitudDisponibilidad.Necesidad.Id).then(function(response) {

            angular.forEach(response.data, function(data){
              if($scope.apropiaciones.indexOf(data.Apropiacion) === -1) {
                  $scope.apropiaciones.push(data.Apropiacion);
              }
              });
          });
              break;

          case "otro":

          break;
          default:
      }
  };


    self.cargarDatos = function(offset){

            self.gridOptions.data = [];
            var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
            var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
            self.cargando = true;
            self.hayData = true;
            if (inicio !== undefined && fin !== undefined) {

              financieraMidRequest.cancelSearch;
              financieraMidRequest.get('disponibilidad/Solicitudes/'+self.Vigencia,$.param({
                UnidadEjecutora: self.UnidadEjecutora,
                rangoinicio: inicio,
                rangofin: fin,
                offset: offset
              })).then(function(response) {

              if (response.data === null){

                self.hayData = false;
                self.cargando = false;
                self.gridOptions.data = [];

              }else{

                self.hayData = true;
                self.cargando = false;
                self.gridOptions.data = response.data;

              }


              });

              self.fechaInicio = undefined;
              self.fechaFin = undefined;
              self.hayData = true;
            }else{

              financieraMidRequest.cancelSearch;
              financieraMidRequest.get('disponibilidad/Solicitudes/'+self.Vigencia,$.param({
                UnidadEjecutora: self.UnidadEjecutora,
                offset: offset
              })).then(function(response) {
              if (response.data === null){

                self.hayData = false;
                self.cargando = false;
                self.gridOptions.data = [];

              }else{

                self.hayData = true;
                self.cargando = false;
                self.gridOptions.data = response.data;
              }



              });
            }

    };

    //-------------------------------
    self.limpiar_alertas= function(){
      self.alerta_registro_cdp = "";
    };

    //funcion para actualizar grid
    self.actualiza_solicitudes = function () {
      financieraMidRequest.get('disponibilidad/Solicitudes/'+self.Vigencia,$.param({
          UnidadEjecutora: self.UnidadEjecutora
        })).then(function(response) {
        self.gridOptions.data.length = 0;
        self.gridOptions.data = response.data;


      });
      };
    //----------------------------

    //generar la disponibilidad (peticion al mid api)
    self.generar_disponibilidad = function(){
      var arrSolicitudes = [];
      self.data.Responsable = 876543216;
      self.data.Afectacion = $scope.afectacion[0];
      arrSolicitudes[0] = self.data;

        financieraMidRequest.post('disponibilidad/ExpedirDisponibilidad?tipoDisponibilidad=1', arrSolicitudes).then(function(response){

            if (response.data[0].Type !== undefined){
              if (response.data[0].Type === "error"){
                swal('',$translate.instant(response.data[0].Code),response.data[0].Type);
              }else{
                var data = response.data[0];
                var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('DETALLE') + "</th>"+ "</th><th>" + $translate.instant('NO_CDP') + "</th>"+ "</th><th>" + $translate.instant('VIGENCIA') + "</th>";
                templateAlert = templateAlert + "<tr class='success'><td>" + self.data.SolicitudDisponibilidad.Numero + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>"+ "<td>" + data.Body.NumeroDisponibilidad + "</td>"+ "<td>" + data.Body.Vigencia + "</td>" + "</tr>" ;
                templateAlert = templateAlert + "</table>";

                swal({
                  title: '',
                  type: response.data[0].Type,
                  width: 800,
                  html: templateAlert,
                  showCloseButton: true,
                  confirmButtonText: 'Cerrar'
                }).then(function(){
                  $("#myModal").modal('hide');
                  self.cargarDatos(0,'');
                });

                // swal('',$translate.instant(response.data[0].Code)+" "+response.data[0].Body.NumeroDisponibilidad,response.data[0].Type).then(function(){
                //   $("#myModal").modal('hide');
                //   self.cargarDatos(0,'');
                // });
              }

            }
          //alert(data);
          });
    };
    self.gridOptions.multiSelect = false;

     //-----------------------------

     self.Rechazar = function (){
       var solicitud = self.gridApi.selection.getSelectedRows();
       $("#myModal").modal('hide');
       swal({
         title: $translate.instant('ALERTA_JUSTIFICACION_RECHAZO'),
         input: 'textarea',
         showCancelButton: true,
         inputValidator: function (value) {
           return new Promise(function (resolve, reject) {
             if (value) {
               resolve();
             } else {
               reject($translate.instant('ALERTA_JUSTIFICACION_RECHAZO'));
             }
           });
         }
       }).then(function(text) {

         solicitud[0].SolicitudDisponibilidad.JustificacionRechazo = text;

         var sl = solicitud[0].SolicitudDisponibilidad;
           administrativaRequest.put('solicitud_disponibilidad/', sl.Id , sl).then(function(response) {

             self.actualiza_solicitudes();
             if (response.data.Type !== undefined) {
               if (response.data.Type === "error") {
                 swal('', $translate.instant(response.data.Code), response.data.Type);
                   self.actualiza_solicitudes();
               } else {
                 swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {


                 });
               }

             }

           });

       });
     };



     $scope.$watch("cdpSolicitudConsulta.Vigencia", function() {


       self.cargarDatos(0,'');

      if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {

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


  });
