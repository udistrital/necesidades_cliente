'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:metasActividades
 * @description
 * # metasActividades
 */
angular.module('contractualClienteApp')
  .directive('metasActividades', function (metasRequest,$translate) {
    return {
      restrict: 'E',
      scope: {
        apropiacion: '=',
        metas : '=',
        dependenciasolicitante: '=',
        dependenciadestino: '=',
        vigencia: '='
      },


      templateUrl: 'views/directives/metas/metas-actividades.html',
      controller: function ($scope) {
        var self = this;
        self.actividades = $scope.actividades;
        self.meta = undefined;
        self.MontoPorMeta=0;
        self.gridOptions = {
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: null,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 8,
          useExternalPagination: false,
          multiSelect: true,
          columnDefs: [{
            field: 'actividad_id',
            displayName: 'Código',
            width: '20%',
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.actividad_id;
            }
          },
          {
            field: 'actividad',
            displayName: 'Actividad',
            width: '50%',
            headerCellClass: $scope.highlightFilteredHeader + ' text-info',
            cellTooltip: function (row) {
              return row.entity.actividad;
            }
          },
          {
            field: 'valor_actividad',
            displayName: 'Saldo Actividad',
            cellFilter: 'currency',
            width: '30%',
            headerCellClass: $scope.highlightFilteredHeader + ' text-info',
            cellTooltip: function (row) {
              return row.entity.valor_actividad;
            }
          }
          ]
        };

        self.cargarMetas = function () {
          metasRequest.get('plan_adquisiciones/2019/'+$scope.dependenciasolicitante.toString()).then(
            function (res) {
              var tempmetas = res.data.metas.actividades; // falta un filter por rubro
              self.metas=[];
              tempmetas.forEach(function(act){
                (self.metas.filter(function(m){ return (m.Id === act.meta_id);}).length === 0) ? self.metas.push({Id: act.meta_id , Nombre: act.meta}) : _ ;
              })
            }
          );
        }

        $scope.$watch('apropiacion', function () {
          if ($scope.apropiacion !== undefined) {
            self.cargarMetas();
          }
        });

        $scope.$watch('d_metasActividades.actividades', function () {
          self.MontoPorMeta=0;
          if (self.actividades !== undefined) {
            self.actividades ? self.actividades.forEach(function(act){
              act.ActividadId = act.actividad_id;
              act.MetaID = act.meta_id;
              act.FuentesActividad ? act.FuentesActividad.forEach(function(f){
                f.FuenteId=f.fuente_financiamiento;
                if(parseFloat(f.MontoParcial)>parseFloat(f.valor_fuente_financiamiento)-parseFloat(f.saldo_comprometido)){
                  swal({
                    title: 'Error Valor Fuentes de Financiamiento ' + act.actividad_id,
                    type: 'error',
                    text: 'Verifique los valores de fuentes de financiamiento, la suma no puede superar el saldo asignado.',
                    showCloseButton: true,
                    confirmButtonText: $translate.instant("CERRAR")
                  });
                  f.MontoParcial=0;
                } else {
                  self.MontoPorMeta+=f.MontoParcial;
                }
                
              }) : _;
              
            }) : _;
          }
          $scope.metas.length>0 ? $scope.metas[0].MontoPorMeta = self.MontoPorMeta : _ ; 
        },true);

        $scope.$watch('d_metasActividades.meta',function () {
          if(self.meta !== undefined){
            $scope.metas = [{MetaId: self.meta}];
            self.loadActividades();
          }

        });

        
        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            self.actividades = self.gridApi.selection.getSelectedRows()
            self.actividades.forEach(function(a){
              self.getFuentesActividad($scope.vigencia,a.dependencia,a.rubro,a.actividad_id).then(function(res){
                var fuentesact = res.data.fuentes.fuentes_actividad ? res.data.fuentes.fuentes_actividad : [] ;
                a.FuentesActividad =  a.FuentesActividad ?  a.FuentesActividad : fuentesact;
              });
            });
            $scope.metas[0].Actividades = self.actividades;
          });

        };
        self.getFuentesActividad = function(vigencia, dependencia, rubro, actividadid){
          return  metasRequest.get('plan_adquisiciones_fuentes_financiamiento/'+vigencia+'/'+dependencia+'/'+rubro+'/'+actividadid)
        }
        
 
        self.loadActividades = function () {
          metasRequest.get('plan_adquisiciones/2019/'+$scope.dependenciasolicitante.toString()).then(function (response) {
            self.gridOptions.data = response.data.metas.actividades

          }).then(function () {
            // Se inicializa el grid api para seleccionar
            if($scope.dependenciasolicitante !== undefined && $scope.dependenciadestino !== undefined){
              self.gridOptions.data=self.gridOptions.data.filter(function(m){
                return (m.meta_id === self.meta) && (m.dependencia === $scope.dependenciasolicitante.toString() || m.dependencia === $scope.dependenciadestino.toString() ); 
               });
               if(self.gridOptions.data.length > 0){
                 self.gridApi.grid.modifyRows(self.gridOptions.data);
               }else{
                 swal({
                   title: '¡No hay actividades!',
                   type: 'error',
                   text: 'Las dependencias no están asociadas a la meta seleccionada.Por favor seleccione otra meta',
                   showCloseButton: true,
                   confirmButtonText: "CERRAR"
               });
               

               }
            } else {
              self.gridOptions.data=[];
              self.gridApi.grid.modifyRows(self.gridOptions.data);
              swal({
                title: '¡No hay Dependencias Seleccionadas!',
                type: 'error',
                text: 'Las dependencias no han sido seleccionadas',
                showCloseButton: true,
                confirmButtonText: "CERRAR"
            });
            }

            
          });
        }


        self.loadFuentesFinanciamiento = function(){
          metasRequest.get('plan_adquisiciones_fuentes_financiamiento/2019/122/388/1.2')
        }

        // se observa cambios en actividades para seleccionar las respectivas filas en la tabla
        $scope.$watch('actividades', function () {
          $scope.actividades ? $scope.actividades.forEach(function (act) {
            var tmp = self.gridOptions.data.filter(function (e) { return e.Id !== act.Id })
            if (tmp.length > 0) {
              self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
            }
          }) : _;
          self.actividades = $scope.actividades;
        });

        $scope.$watch('[d_listaDocumentosLegales.gridOptions.paginationPageSize, d_listaDocumentosLegales.gridOptions.data]', function () {
          if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize === null) && self.gridOptions.data.length > 0) {
            $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
            if (self.gridOptions.data.length <= 5) {
              self.gridOptions.enablePaginationControls = false;
            }
          } else {
            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
            self.gridOptions.enablePaginationControls = true;
          }
        }, true);

      },
      controllerAs: 'd_metasActividades'
    };
  });
