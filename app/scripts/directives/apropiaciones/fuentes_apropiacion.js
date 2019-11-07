'use strict'

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiaciones/fuentesApropiacion
 * @description
 * # apropiaciones/fuentesApropiacion
 */
angular.module('contractualClienteApp')
  .directive('fuentesApropiacion', function (planCuentasRequest) {
    return {
      restrict: 'E',
      scope: {
        apropiacion: '=',
        fuenteapropiacion: '=',
        dependenciasolicitante: '='
      },
      templateUrl: 'views/directives/apropiaciones/fuentes_apropiacion.html',
      controller: function ($scope, $translate) {
        var self = this
        $scope.fuente = $translate.instant('FUENTE')
        self.fuenteapropiacion = $scope.fuenteapropiacion;
        self.gridOptions = {
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 5,
          enableRowSelection: true,
          enableFiltering: true,
          enableRowHeaderSelection: false,
          useExternalPagination: false,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          enableSelectAll: true,
          columnDefs: [{
            field: 'Nombre',
            displayName: $translate.instant('FUENTE'),
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.Nombre
            }
          }
          ,
          {
            field: 'ValorActual',
            displayName: $translate.instant('VALOR'),
            cellFilter: 'currency',
            headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
            cellClass: function (row, col) {
              return 'money'
            },
            cellTooltip: function (row) {
              return row.entity.ValorActual || 0;
            },
            width: '40%'
          }
        ]
        }

        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            $scope.fuenteapropiacion = self.gridApi.selection.getSelectedRows().map(function (e) {
              if($scope.fuenteapropiacion.filter(function(f){ return f.FuenteId===e.Codigo}).length>0) {
                return $scope.fuenteapropiacion.filter(function(f){ return f.FuenteId===e.Codigo})[0];
              } else {
                return {FuenteId: e.Codigo};
              }
              
            });

          })
        }


        planCuentasRequest.get('fuente_financiamiento/fuente_financiamiento_apropiacion/' + $scope.apropiacion.Apropiacion.Codigo+"/"+ $scope.apropiacion.Apropiacion.Vigencia + "/"+$scope.apropiacion.Apropiacion.UnidadEjecutora ).then(function (response) {
          self.gridOptions.data = response.data.Body || [];

          var gridOptData = self.gridOptions.data;
          gridOptData[0] !== undefined ? self.gridApi.grid.modifyRows(gridOptData) : _;

          $scope.$watch('fuenteapropiacion', function () {
            $scope.fuenteapropiacion ? $scope.fuenteapropiacion.forEach(function (act) {
              var tmp = self.gridOptions.data.filter(function (e) { return e.Codigo !== act.Codigo })

              if (tmp.length > 0) {
                self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
              }
            }) : _;
            self.fuenteapropiacion = $scope.fuenteapropiacion;
          })
        })

        $scope.$watch('[d_fuentesApropiacion.gridOptions.paginationPageSize, d_fuentesApropiacion.gridOptions.data]', function () {
          if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize === null) && self.gridOptions.data.length > 0) {
            $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight)
            if (self.gridOptions.data.length <= 5) {
              self.gridOptions.enablePaginationControls = false
            }
          } else {
            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight)
            self.gridOptions.enablePaginationControls = true
          }
        }, true)
      },
      controllerAs: 'd_fuentesApropiacion'
    }
  })
