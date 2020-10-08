'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.listaActividadesEconomicas
 * @description
 * # listaActividadesEconomicas
 */
angular.module('contractualClienteApp')
  .directive('listaActividadesEconomicas', function (parametrosGobiernoRequest, $translate) {
    return {
      restrict: 'E',
      scope: {
        actividades: '=?',
        idActividades: '=?'
      },
      templateUrl: 'views/directives/actividades_economicas/lista_actividades_economicas.html',
      controller: function ($scope) {
        var self = this;

        self.gridOptions = {
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 5,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          useExternalPagination: false,
          enableSelectAll: false,
          columnDefs: [{
            field: 'Id',
            visible: false
          },
          {
            field: 'Id',
            displayName: $translate.instant('CODIGO'),
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            width: '20%',
            cellTooltip: function (row) {
              return row.entity.Id;
            }
          },
          {
            field: 'Nombre',
            displayName: $translate.instant('ACTIVIDAD_ECONOMICA'),
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.Nombre;
            }
          }
          ]
        };

        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            $scope.actividades = self.gridApi.selection.getSelectedRows();
            $scope.idActividades = $scope.actividades.map(function(e) {return {ActividadEconomicaId : e.Id}})
          });
        };

        parametrosGobiernoRequest.get('actividad_economica', $.param({
          limit: -1,
          query: "ClasificacionCiiuId.Nombre:Subclase,Activo:true",
          sortby: "Id",
          order: "asc",
        })).then(function (response) {
          self.gridOptions.data = response.data;
        }).then(function () {
          // Se inicializa el grid api para seleccionar
          self.gridApi.grid.modifyRows(self.gridOptions.data);

          // se observa cambios en idActividades para completar $scope.actividades y seleccionar las respectivas filas en la tabla
          $scope.$watch('idActividades', function () {
            self.actividades = [];
            $scope.idActividades.forEach(function (id) {
              var tmp = self.gridOptions.data.filter(function (e) {return e.Id === id.ActividadEconomicaId; });
              if (tmp.length > 0) {
                $scope.actividades.push(tmp[0]); //enriquecer actividades
                self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
              }
            });
            $scope.actividades = self.gridApi.selection.getSelectedRows();
          });
        });

        $scope.$watch('[d_listaActividadesEconomicas.gridOptions.paginationPageSize, d_listaActividadesEconomicas.gridOptions.data]', function () {
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

      controllerAs: 'd_listaActividadesEconomicas'
    };
  });
