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
      },


      templateUrl: 'views/directives/metas/metas-actividades.html',
      controller: function ($scope) {
        var self = this;
        self.actividades = [];
        self.meta = undefined;
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
            field: 'Id',
            displayName: 'Código',
            width: '20%',
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.Id;
            }
          },
          {
            field: 'Descripcion',
            displayName: 'Actividad',
            width: '80%',
            headerCellClass: $scope.highlightFilteredHeader + ' text-info',
            cellTooltip: function (row) {
              return row.entity.Descripcion;
            }
          }
          ]
        };

        self.cargarMetas = function () {
          metasRequest.get('Metas').then(
            function (res) {
              self.metas = res.data.Metas;
            }
          );
        }

        $scope.$watch('apropiacion', function () {
          if ($scope.apropiacion !== undefined) {
            self.cargarMetas();
          }
        });

        $scope.$watch('d_metasActividades.meta',function () {
          if(self.meta !== undefined){
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
          metasRequest.get('Actividades').then(function (response) {
            self.gridOptions.data = response.data;
          }).then(function () {
            // Se inicializa el grid api para seleccionar
            self.gridApi.grid.modifyRows(self.gridOptions.data);
          });
        }



        // se observa cambios en actividades para seleccionar las respectivas filas en la tabla
        $scope.$watch('actividades', function () {
          $scope.actividades.forEach(function (act) {
            var tmp = self.gridOptions.data.filter(function (e) { return e.Id == act.Id })
            if (tmp.length > 0) {
              self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
            }
          });
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
