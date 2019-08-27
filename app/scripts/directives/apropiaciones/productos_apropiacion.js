'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiaciones/productosApropiacion
 * @description
 * # apropiaciones/productosApropiacion
 */
angular.module('contractualClienteApp')
  .directive('productosApropiacion', function (planCuentasRequest) {
    return {
      restrict: 'E',
      scope: {
        rubro: '=',
        productoapropiacion: '=',
        initProductoapropiacion: '=?',
      },
      templateUrl: 'views/directives/apropiaciones/productos_apropiacion.html',
      controller: function ($scope, $translate) {
        var self = this;

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
            displayName: $translate.instant('PRODUCTOS'),
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
            $scope.productoapropiacion = self.gridApi.selection.getSelectedRows();
          });
        };

        planCuentasRequest.get('producto').then(function (response) {
          self.gridOptions.data = response.data.Body;
        }).then(function (t) {
          var gridOptData = Object.values(self.gridOptions.data);
          self.gridApi.grid.modifyRows(gridOptData[0]);
          

          $scope.$watch('initProductoApropiacion', function () {
            self.productoapropiacion = [];
            $scope.initProductoapropiacion.forEach(function (producto) {
              var tmp = self.gridOptions.data.filter(function (e) { return e._id == producto._id })
              if (tmp.length > 0) {
                $scope.productoapropiacion.push(tmp[0]); //enriquecer productos
                self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
              }
            });
          });
        });

        $scope.$watch('[d_productosApropiacion.gridOptions.paginationPageSize, d_productosApropiacion.gridOptions.data]', function () {
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
      controllerAs: 'd_productosApropiacion'
    };
  });
