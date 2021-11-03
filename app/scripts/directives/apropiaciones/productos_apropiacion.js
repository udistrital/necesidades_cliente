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
        apropiacion: "=",
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
            field: 'Codigo',
            displayName: $translate.instant('CODIGO'),
            width: "15%",
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.Codigo;
            }
          },
          {
            field: 'Nombre',
            displayName: $translate.instant('NOMBRE'),
            width: "75%",
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.Nombre;
            }
          },
          {
            field: 'PorcentajeDistribucion',
            displayName: '% Dist.',
            width: "15%",
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.PorcentajeDistribucion;
            }
          }
          ]
        };

        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            $scope.productoapropiacion = self.gridApi.selection.getSelectedRows();
            $scope.productoapropiacion.forEach(function (p) {
              p.ProductoId = p._id
              p.MontoParcial = 0
            })
          });
        };


        var idProductos = [];
        var productosData = [];
        for (var id in $scope.rubro.Productos) {
          idProductos.push(id);
        }

        Promise.all($scope.apropiacion.Apropiacion.datos[0]["registro_funcionamiento-productos_asociados"]).then(function (productos) {
          productos.map(function (item) {
            console.log({ item });

            const productoSchema = {
              Nombre: item.ProductoData.Nombre,
              Codigo: item.ProductoData.Codigo,
              PorcentajeDistribucion: item.PorcentajeDistribucion,
              _id: item.ProductoAsociadoId,
            }

            if (productosData.length > 0) {
              if(productosData.some(function(uniqueProducto) {
                return productoSchema._id === uniqueProducto._id;
              })){

              } else {
                productosData.push(productoSchema);
              }
            } else {
              productosData.push(productoSchema);
            }
          })

          self.gridOptions.data = [];
          self.gridOptions.data = productosData;
          var gridOptData = self.gridOptions.data;
          gridOptData[0] !== undefined ? self.gridApi.grid.modifyRows(gridOptData) : _;


          $scope.$watch('initProductoApropiacion', function () {
            self.productoapropiacion = [];
            $scope.initProductoapropiacion ? $scope.initProductoapropiacion.forEach(function (producto) {
              var tmp = self.gridOptions.data.filter(function (e) { return e._id == producto._id })
              if (tmp.length > 0) {
                $scope.productoapropiacion.push(tmp[0]); //enriquecer productos
                self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
              }
            }) : _;
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
