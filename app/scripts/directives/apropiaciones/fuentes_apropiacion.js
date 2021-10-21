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
        self.editando = false;
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
          columnDefs: [
            {
              field: 'Nombre',
              displayName: $translate.instant('FUENTE'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTooltip: function (row) {
                return row.entity.Nombre
              }
            },
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
            },
          ]
        }



        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            if (self.editando === true) {
              $scope.fuenteapropiacion = self.gridApi.selection.getSelectedRows().map(function (e) {
                if ($scope.fuenteapropiacion.filter(function (f) { return f.FuenteId === e.Codigo }).length > 0) {
                  $scope.fuenteapropiacion.filter(function (f) { return f.FuenteId === e.Codigo })[0].Saldo = e.ValorActual;
                  return $scope.fuenteapropiacion.filter(function (f) { return f.FuenteId === e.Codigo })[0];
                } else {
                  return { FuenteId: e.Codigo, Saldo: e.ValorActual, Nombre: e.Nombre };
                }
              });
            }
          })
        }
        self.gridOptions.data = [];
        $scope.apropiacion.Apropiacion.datos[0].FuenteFinanciamientoData ? self.gridOptions.data.push($scope.apropiacion.Apropiacion.datos[0].FuenteFinanciamientoData) : _;

        var gridOptData = self.gridOptions.data;

        // !Verificar línea porque self.gridApi es undefined, sin embargo, al parecer la línea no afecta la funcionalidad
        // gridOptData[0] !== undefined ? self.gridApi.grid.modifyRows(gridOptData) : _;

        $scope.$watch('fuenteapropiacion', function () {
          $scope.fuenteapropiacion ? $scope.fuenteapropiacion.forEach(function (fuente) {
            if (fuente.MontoParcial && fuente.Saldo && fuente.MontoParcial > fuente.Saldo) {
              swal({
                title: 'Error Valor Fuentes de Financiamiento ' + fuente.FuenteId,
                type: 'error',
                text: 'Verifique los valores de fuentes de financiamiento, la suma no puede superar el saldo asignado.',
                showCloseButton: true,
                confirmButtonText: $translate.instant("CERRAR")
              });
              fuente.MontoParcial = 0;
            }
            var tmp = self.gridOptions.data.filter(function (e) { return e.Codigo === fuente.FuenteId })
            if (tmp.length > 0) {
              self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
            }
          }) : _;
          self.editando = true;
          self.fuenteapropiacion = $scope.fuenteapropiacion;
        }, true)

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
