'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:catalogosElementos/listaSubgruposCatalogos
 * @description
 * # catalogosElementos/listaSubgruposCatalogos
 */
angular.module('contractualClienteApp')
    .directive('listaSubgruposCatalogos', function (catalogoRequest, $translate) {
        return {
            restrict: 'E',
            scope: {
                elemento: '=',
                producto_catalogo: '=ngModel'
            },
            templateUrl: 'views/directives/catalogos_elementos/lista_subgrupos_catalogos.html',
            controller: function ($scope) {
                var self = this;
                $scope.producto_catalogo = {};
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
                    enablePaginationControls: true,
                    multiSelect: false,
                    columnDefs: [{
                        field: 'Id',
                        displayName: $translate.instant('CODIGO'),
                        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                        cellTooltip: function (row) {
                            return row.entity.Id;
                        }
                    },
                    {
                        field: 'Descripcion',
                        displayName: $translate.instant('PRODUCTOS'),
                        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                        cellTooltip: function (row) {
                            return row.entity.Descripcion;
                        }
                    }
                    ]
                };
                self.loadData = function (elemento) {
                        catalogoRequest.get('elemento', $.param({
                        query: "Descripcion__contains:"+elemento,
                        fields: 'Id,Descripcion',
                        limit: 15,
                        sortby: "Descripcion",
                        order: "asc",
                    })).then(function (response) {
                        self.gridOptions.data = response.data;
                        if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize === null) && self.gridOptions.data.length > 0) {
                            $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
                            if (self.gridOptions.data.length <= 5) {
                                self.gridOptions.enablePaginationControls = false;
                            }
                        } else {
                            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
                            self.gridOptions.enablePaginationControls = true;
                        }
                    });
                }
                self.loadData($scope.elemento);
                self.gridOptions.onRegisterApi = function (gridApi) {
                    self.gridApi = gridApi;
                    self.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.producto_catalogo ={CatalogoId: row.entity.Id, ElementoNombre: row.entity.Descripcion,RequisitosMinimos: []};
                    });

                };

            },
            controllerAs: 'd_listaSubgruposCatalogos'
        };
    });
