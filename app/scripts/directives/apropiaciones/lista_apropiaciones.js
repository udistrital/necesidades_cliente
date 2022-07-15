"use strict";

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiaciones/listaApropiaciones
 * @description
 * # apropiaciones/listaApropiaciones
 */
angular
  .module("contractualClienteApp")
  .directive("listaApropiaciones", function (movimientosCrudRequest, $translate) {
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
              field: "ValorActual",
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
                $scope.tipo = "3-00";
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
                var Cuen_Pre = "";
                var Movimiento ={};
                var saldo = 0;
                var jsonCompleto;
                var arreglo =[];
                var rubroMov = null;
                var actividadIdMov = null;
                var fuenteIdMov = null;
                info.datos.forEach(function(rubro){
                  if($scope.tipofinanciacion.Id === 1){
                    rubroMov = rubro.RubroId;
                    rubro["registro_plan_adquisiciones-actividad"].forEach(function(actividad){
                      actividadIdMov = actividad.actividad.Id;
                      actividad.FuentesFinanciamiento.forEach(function(fuente){
                        fuenteIdMov = fuente.FuenteFinanciamiento;
                        Cuen_Pre = JSON.stringify({
                          RubroId:rubroMov,
                          ActividadId:actividadIdMov,
                          FuenteFinanciamientoId:fuenteIdMov,
                          PlanAdquisicionesId:$scope.planadquisicion.id
                        });
                        Movimiento = {};
                        Movimiento.Cuen_Pre = Cuen_Pre;
                        arreglo.push(Movimiento);
                      })
                    })
                  }else{
                    rubroMov = rubro.RubroId;
                    fuenteIdMov = rubro.FuenteFinanciamientoId;
                    Cuen_Pre = JSON.stringify({
                      RubroId:rubroMov,
                      FuenteFinanciamientoId:fuenteIdMov,
                      PlanAdquisicionesId:$scope.planadquisicion.id
                    });
                    Movimiento.Cuen_Pre = Cuen_Pre;
                    arreglo.push(Movimiento);
                  }
                })
                jsonCompleto = JSON.stringify(arreglo);
                // TODO: Implementar mecanismo retry, hasta un maximo de 3 intentos
                movimientosCrudRequest
                .post("movimiento_detalle/postUltimoMovDetalle/",jsonCompleto)
                .then(function(respuestamov){
                  if(respuestamov.data){
                    $scope.movimiento = respuestamov.data;
                    respuestamov.data.forEach(function(movimiento){
                      saldo += movimiento.Saldo;
                    })
                    info.RubroInfo.ValorActual = saldo;
                    self.gridOptions.data.push(info.RubroInfo);
                  }
                });
              })
            }
          });
        };

        $scope.$watch('movimiento', function () {
          $scope.$emit('pasomovimiento',$scope.movimiento);
        });

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
