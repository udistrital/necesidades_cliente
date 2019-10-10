'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:metasActividades
 * @description
 * # metasActividades
 */
angular.module('contractualClienteApp')
  .directive('metasActividades', function (metasRequest) {
    return {
      restrict: 'E',
      scope: {
        apropiacion: '=',
        actividades: '=',
        meta : '=',
        dependenciasolicitante: '=',
        dependenciadestino: '='
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
            displayName: 'Id',
            width: '20%',
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.actividad_id;
            }
          },
          {
            field: 'actividad',
            displayName: 'Actividad',
            width: '80%',
            headerCellClass: $scope.highlightFilteredHeader + ' text-info',
            cellTooltip: function (row) {
              return row.entity.actividad;
            }
          }
          ]
        };

        self.cargarMetas = function () {
          metasRequest.get('2019').then(
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
            self.actividades.forEach(function(act){
              self.MontoPorMeta+=act.MontoParcial;
            })
          }
        },true);

        $scope.$watch('d_metasActividades.meta',function () {
          if(self.meta !== undefined){
            $scope.meta = self.meta.Id;
            self.loadActividades();
          }

        });

        
        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            $scope.actividades = self.gridApi.selection.getSelectedRows();
          });

        };

        self.loadActividades = function () {
          metasRequest.get('2019').then(function (response) {
            self.gridOptions.data = response.data.metas.actividades;
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
                   title: '¡No hay Actividades!',
                   type: 'error',
                   text: 'Las dependencias no están asociadas a la meta seleccionada . Por favor seleccione otra meta',
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
