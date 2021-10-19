"use strict";

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiaciones/listaApropiaciones
 * @description
 * # apropiaciones/listaApropiaciones
 */
angular
  .module("contractualClienteApp")
  .directive("listaApropiaciones", function (planCuentasRequest, $translate) {
    return {
      restrict: "E",
      scope: {
        apropiacion: "=?",
        vigencia: "=",
        tipo: "<",
        unidadejecutora: "=",
        tipofinanciacion: "=",
        selhijos: "=?",
        planadquisicion: "=",
      },

      templateUrl: "views/directives/apropiaciones/lista_apropiaciones.html",
      controller: function ($scope) {
        var self = this;
        self.gridOptions = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,
          // showTreeExpandNoChildren: false,

          columnDefs: [
            {
              field: "Codigo",
              displayName: $translate.instant("CODIGO_RUBRO"),
              headerCellClass: $scope.highlightFilteredHeader + "text-center ",
              cellClass: function (row, col) {
                if (col.treeNode.children.length === 0) {
                  return "unbold ";
                } else {
                  return "unbold";
                }
              },
              width: "25%",
            },
            {
              field: "Nombre",
              displayName: $translate.instant("NOMBRE_RUBRO"),
              headerCellClass: $scope.highlightFilteredHeader + "text-center ",
              cellTooltip: function (row) {
                return row.entity.Nombre;
              },
              cellClass: function (row, col) {
                if (col.treeNode.children.length === 0) {
                  return "unbold ";
                } else {
                  return "unbold";
                }
              },
              width: "50%",
            },
            {
              field: "ValorInicial",
              displayName: $translate.instant("VALOR_U"),
              cellFilter: "currency",
              // cellTemplate: '<div align="right">{{data.ApropiacionInicial | currency}}</div>',
              headerCellClass: $scope.highlightFilteredHeader + "text-center ",
              cellClass: function (row, col) {
                if (col.treeNode.children.length === 0) {
                  return "money";
                } else {
                  return "money";
                }
              },
              width: "20%",
            },
          ],
        };

        $scope.$watchGroup(
          ["unidadejecutora", "tipofinanciacion", "planadquisicion"],
          function () {
            var actualizar = false;            
            if (
              $scope.unidadejecutora !== undefined &&
              $scope.tipofinanciacion !== undefined && 
              $scope.planadquisicion !== undefined
            ) {

              // UD inversion
              if (
                $scope.unidadejecutora === 1 &&
                $scope.tipofinanciacion.Id === 1
              ) {
                $scope.tipo = "3-03";
                actualizar = true;

              // UD funcionamiento
              }
              if (
                $scope.unidadejecutora === 1 &&
                $scope.tipofinanciacion.Id === 2
              ) {
                $scope.tipo = "3-01";
                actualizar = true;

              // IDEXUD inversion, no existen
              }
              if (
                $scope.unidadejecutora === 2 &&
                $scope.tipofinanciacion.Id === 1
              ) {
                $scope.tipo = "XYZ";

              // IDEXUD funcionamiento
              } 
              if (
                $scope.unidadejecutora === 2 &&
                $scope.tipofinanciacion.Id === 2
              ) {
                $scope.tipo = "3-00"; // ! Cambiado de 3-00-991 a 3-00
                actualizar = true;
              }
            }
            if(actualizar) {
              self.actualiza_rubros();
            }
          },
          true
        );

        self.actualiza_rubros = function () {
          self.gridOptions.data = [];
          $scope.planadquisicion.registroplanadquisiciones.forEach(function(item){
            if(item.Fuente === $scope.tipo){
              item.datos.forEach(function(info){
                info.RubroInfo.datos = info.datos;
                self.gridOptions.data.push(info.RubroInfo);
              }) 
            }
          });
          /*planCuentasRequest
            .get(
              "arbol_rubro_apropiacion/get_hojas/" +
              // $scope.unidadejecutora +
              // ! Se debe hacer el llamado a la Unidad Ejecutora correspondiente 
              "1" +
              "/" +
              $scope.vigencia
            )
            .then(function (response) {
              if (response.data.Body !== null) {
                console.log("Cuerpo filtrado", response.data.Body);
                response.data.Body = response.data.Body.filter(function (a) {
                  // Función para filtrar rubros por código
                  return a.Codigo.startsWith($scope.tipo);
                });
                self.gridOptions.data = response.data.Body.sort(function (
                  a,
                  b
                ) {
                  if (a.Codigo < b.Codigo) {
                    return -1;
                  }
                  if (a.Codigo > b.Codigo) {
                    return 1;
                  }
                  return 0;
                });

                console.log("GridOptionsData: ", self.gridOptions.data);
                self.max_level = 0;
                var level = 0;
                // for (var i = 0; i < self.gridOptions.data.length; i += 1) {
                //     level = (self.gridOptions.data[i].Codigo.match(/-/g) || []).length;
                //     if (level > self.max_level) {
                //         self.max_level = level;
                //     }
                // }

                // for (var j = 0; j < self.gridOptions.data.length; j += 1) {
                //     level = (self.gridOptions.data[j].Codigo.match(/-/g) || []).length;
                //     if (level < self.max_level) {
                //         self.gridOptions.data[j].$$treeLevel = level;
                //     }
                // }
              } else {
                self.gridOptions.data = [];
              }
            });*/
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
            return true;
          } else {
            return true;
          }
        };

        self.gridOptions.multiSelect = false;
      },
      controllerAs: "d_listaApropiaciones",
    };
  });
