'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiaciones/listaApropiaciones
 * @description
 * # apropiaciones/listaApropiaciones
 */
angular.module('contractualClienteApp')
    .directive('listaApropiaciones', function (planCuentasRequest, $translate) {
        return {
            restrict: 'E',
            scope: {
                apropiacion: '=?',
                vigencia: "=",
                tipo: "<",
                unidadejecutora: "=",
                tipofinanciacion: "=",
                selhijos: "=?"
            },

            templateUrl: 'views/directives/apropiaciones/lista_apropiaciones.html',
            controller: function ($scope) {
                var self = this;
                self.gridOptions = {
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    enableFiltering: true,
                    showTreeExpandNoChildren: false,

                    columnDefs: [{
                        field: 'Codigo',
                        displayName: $translate.instant('CODIGO_RUBRO'),
                        headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
                        cellClass: function (row, col) {
                            if (col.treeNode.children.length === 0) {
                                return "unbold ";
                            } else {
                                return "text-info";
                            }
                        },
                        width: '15%'
                    },
                    {
                        field: 'Nombre',
                        displayName: $translate.instant('NOMBRE_RUBRO'),
                        headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
                        cellTooltip: function (row) {
                            return row.entity.Nombre;
                        },
                        cellClass: function (row, col) {
                            if (col.treeNode.children.length === 0) {
                                return "unbold ";
                            } else {
                                return "text-info";
                            }
                        },
                        width: '40%'
                    },
                    {
                        field: 'ValorActual',
                        displayName: $translate.instant('VALOR_U'),
                        cellFilter: 'currency',
                        // cellTemplate: '<div align="right">{{data.ApropiacionInicial | currency}}</div>',
                        headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
                        cellClass: function (row, col) {
                            if (col.treeNode.children.length === 0) {
                                return "money";
                            } else {
                                return "money";
                            }
                        },
                        width: '40%'
                    }
                    ]

                };

                $scope.$watchGroup(['unidadejecutora', 'tipofinanciacion'], function () {
                    if ($scope.unidadejecutora !== undefined && $scope.tipofinanciacion !== undefined) {
                        // UD inversion
                        if ($scope.unidadejecutora === 1 && $scope.tipofinanciacion.Id === 1) {
                            $scope.tipo = "3-03";
                        // UD funcionamiento
                        } else if ($scope.unidadejecutora === 1 && $scope.tipofinanciacion.Id === 2) {
                            $scope.tipo = "3-01";
                        // IDEXUD inversion, no existen
                        } else if ($scope.unidadejecutora === 2 && $scope.tipofinanciacion.Id === 1) {
                            $scope.tipo = "XYZ";
                        // IDEXUD funcionamiento
                        } else if ($scope.unidadejecutora === 2 && $scope.tipofinanciacion.Id === 2) {
                            $scope.tipo = "3-00-991";
                        }
                        self.actualiza_rubros();
                    }
                }, true);


                self.actualiza_rubros = function () {
                    console.info("entre a actualziar rubros");
                    planCuentasRequest.get("arbol_rubro_apropiacion/get_hojas/" + $scope.unidadejecutora + "/" + $scope.vigencia).then(function (response) {
                        console.info("hola",response);
                        if (response.data.Body !== null) {
                            response.data.Body = response.data.Body.filter(function (a) {
                                // funcion para filtrar rubros por codigo 
                                return a.Codigo.startsWith($scope.tipo);
                            });
                            self.gridOptions.data = response.data.Body .sort(function (a, b) {
                                if (a.Codigo < b.Codigo) { return -1; }
                                if (a.Codigo > b.Codigo) { return 1; }
                                return 0;
                            });
                            self.max_level = 0;
                            var level = 0;
                            for (var i = 0; i < self.gridOptions.data.length; i += 1) {
                                level = (self.gridOptions.data[i].Codigo.match(/-/g) || []).length;
                                if (level > self.max_level) {
                                    self.max_level = level;
                                }
                            }

                            for (var j = 0; j < self.gridOptions.data.length; j += 1) {
                                level = (self.gridOptions.data[j].Codigo.match(/-/g) || []).length;
                                if (level < self.max_level) {
                                    self.gridOptions.data[j].$$treeLevel = level;
                                }
                            }

                        } else {
                            self.gridOptions.data = [];
                        }
                    });
                };



                self.gridOptions.onRegisterApi = function (gridApi) {
                    //set gridApi on scope
                    self.gridApi = gridApi;
                    self.gridApi.grid.registerDataChangeCallback(function () {
                        self.gridApi.treeBase.expandAllRows();
                    });
                    self.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.apropiacion = row.entity;
                    });
                };

                self.gridOptions.isRowSelectable = function (row) {
                    if (row.treeNode.children.length > 0 && $scope.selhijos === true) {
                        return false;
                    } else {
                        return true;
                    }
                };


                self.gridOptions.multiSelect = false;


            },
            controllerAs: 'd_listaApropiaciones'
        };
    });
