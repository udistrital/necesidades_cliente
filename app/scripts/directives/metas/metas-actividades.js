"use strict";

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:metasActividades
 * @description
 * # metasActividades
 */
angular
  .module("contractualClienteApp")
  .directive("metasActividades", function (metasRequest, $translate) {
    return {
      restrict: "E",
      scope: {
        apropiacion: "=",
        metas: "=",
        dependenciasolicitante: "=",
        dependenciadestino: "=",
        vigencia: "=",
        rubro: "=",
      },

      templateUrl: "views/directives/metas/metas-actividades.html",
      controller: function ($scope) {
        var self = this;
        self.actividades = $scope.actividades;
        self.meta = undefined;
        self.cargainicial = true;
        self.MontoPorMeta = 0;
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
          columnDefs: [
            {
              field: "actividad_id",
              displayName: $translate.instant('CODIGO'),
              width: "20%",
              headerCellClass:
                $scope.highlightFilteredHeader + "text-center text-info",
              cellTooltip: function (row) {
                return row.entity.actividad_id;
              },
            },
            {
              field: "actividad",
              displayName: "Actividad",
              width: "50%",
              headerCellClass: $scope.highlightFilteredHeader + " text-info",
              cellTooltip: function (row) {
                return row.entity.actividad;
              },
            },
            {
              field: "valor_actividad",
              displayName: "Saldo Actividad",
              cellFilter: "currency",
              width: "30%",
              headerCellClass: $scope.highlightFilteredHeader + " text-info",
              cellTooltip: function (row) {
                return row.entity.valor_actividad;
              },
              cellClass: function () {
                return "money";
              },
            },
          ],
        };

        self.cargarMetas = function () {
          if ($scope.dependenciasolicitante) {
            self.metas = [];
            try {
              $scope.apropiacion.Apropiacion.datos[0]["registro_funcionamiento-metas_asociadas"].forEach(function (item) {
                const metaSchema = {
                  Id: item.MetaId.Id,
                  Nombre: item.MetaId.Nombre,
                };
                if (self.metas.length > 0) {
                  self.metas.forEach(function (uniqueMeta) {
                    if (uniqueMeta.Id !== metaSchema.Id) {
                      self.metas.push(metaSchema);
                    }
                  });
                } else {
                  self.metas.push(metaSchema);
                }
              });
            } catch (error) {
              swal({
                title:
                  "Error Metas",
                type: "error",
                text: "No se ha podido traer el arreglo de metas desde el plan de adquisiciones - " + error.message,
                showCloseButton: true,
                confirmButtonText: $translate.instant("CERRAR"),
              });
            } finally {
              if ($scope.apropiacion.Metas.length > 0) {
                self.meta = $scope.apropiacion.Metas[0].MetaId;
              }
              self.editando = true;
            }
          };
        };

        $scope.$watchGroup(
          ["apropiacion", "dependenciasolicitante"],
          function () {
            if (
              $scope.apropiacion.Apropiacion !== undefined &&
              $scope.dependenciasolicitante !== undefined
            ) {
              self.cargarMetas();
            }
          },
          true
        );

        $scope.$watch(
          "d_metasActividades.actividades",
          function () {
            self.MontoPorMeta = 0;
            if (self.actividades !== undefined) {
              self.actividades ? self.actividades.forEach(function (act) {
                act.ActividadId = act.actividad_id;
                act.FuentesActividad ? act.FuentesActividad.forEach(function (f) {
                  f.FuenteId = f.FuenteId || f.fuente_financiamiento;
                  if (
                    parseFloat(f.MontoParcial) >
                    parseFloat(f.valor_fuente_financiamiento) - parseFloat(f.saldo_comprometido)
                  ) {
                    swal({
                      title:
                        "Error Valor Fuentes de Financiamiento " +
                        f.FuenteId +
                        " actividad: " +
                        act.actividad_id,
                      type: "error",
                      text: "Verifique los valores de fuentes de financiamiento, la suma no puede superar el saldo asignado.",
                      showCloseButton: true,
                      confirmButtonText: $translate.instant("CERRAR"),
                    });
                    f.MontoParcial = 0;
                  } else {
                    self.MontoPorMeta += f.MontoParcial;
                  }
                })
                  : _;
              })
                : _;
            }
            $scope.metas.length > 0
              ? ($scope.metas[0].MontoPorMeta = self.MontoPorMeta)
              : _;
          },
          true
        );

        self.ResetMeta = function () {
          $scope.metas = [{ MetaId: self.meta, Actividades: [] }];
          self.actividades = [];
        };

        $scope.$watch("d_metasActividades.meta", function () {
          if (self.meta !== undefined) {
            $scope.metas[0] ? _ : ($scope.metas = [{ MetaId: self.meta }]);
            $scope.metas[0].Actividades && $scope.metas[0].Actividades.length > 0 ? _ : ($scope.metas = [{ MetaId: self.meta }]);
            self.loadActividades();
          }
        });

        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
          if ($scope.metas && $scope.metas[0] && $scope.metas[0].Actividades) {
            self.montos = [];
            $scope.metas[0].Actividades.forEach(function (a) {
              var fuentes = [];
              a.FuentesActividad.forEach(function (f) {
                fuentes.push(f.MontoParcial);
              });
              self.montos.push(fuentes);
            });

            function addMontos() {
              if (self.cargainicial === true && $scope.metas) {
                setTimeout(function () {
                  try {
                    for (
                      var i = 0;
                      i < $scope.metas[0].Actividades.length;
                      i++
                    ) {
                      for (
                        var j = 0;
                        j <
                        $scope.metas[0].Actividades[i].FuentesActividad.length;
                        j++
                      ) {
                        if (
                          $scope.metas[0].Actividades[i].FuentesActividad[j].Id
                        ) {
                          self.cargainicial = true;
                          addMontos();
                          return;
                        }
                        $scope.metas[0].Actividades[i].FuentesActividad[
                          j
                        ].MontoParcial = self.montos[i][j];
                      }
                    }
                    self.cargainicial = false;
                  } catch (error) {
                    addMontos();
                  }
                }, 1000);
              }
            }

            addMontos();
          }
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            self.actividades = self.gridApi.selection.getSelectedRows();
            self.actividades.forEach(function (a) {
              var fuentesact = self.getFuentesActividad(a.actividad_id);
              a.FuentesActividad ? (a.FuentesActividad = a.FuentesActividad) : (a.FuentesActividad = fuentesact);
            });
            $scope.metas[0].Actividades = self.actividades;
          });
        };

        self.getFuentesActividad = function (actividadid) {
          var fuentes = [];
          try {
            $scope.apropiacion.Apropiacion.datos[0]["registro_plan_adquisiciones-actividad"].forEach(function (act) {
              if (Number(actividadid) === act.actividad.Id) {
                if (act.FuentesFinanciamiento.length > 0) {
                  act.FuentesFinanciamiento.map(function (fuente) {
                    const fuenteSchema = {
                      FuenteId: fuente.FuenteFinanciamiento,
                      ValorAsignado: fuente.ValorAsignado,
                      Nombre: fuente.Nombre
                    }

                    if (fuentes.length > 0) {
                      fuentes.forEach(function (uniqueFuente) {
                        if (uniqueFuente.Id !== fuenteSchema.FuenteId) {
                          fuentes.push(fuenteSchema);
                        }
                      });
                    } else {
                      fuentes.push(fuenteSchema);
                    }
                  })
                }
              }
            })
            console.log(fuentes);
          } catch (error) {
            swal({
              title: "Error Fuentes",
              type: "error",
              text: "No se ha podido acceder a las fuentes del plan de adquisiciones " + error.message,
              showCloseButton: true,
              confirmButtonText: $translate.instant("CERRAR"),
            });
          } finally {
            return fuentes;
          }
        };

        self.loadActividades = function () {
          self.gridOptions.data = [];
          try {
            $scope.apropiacion.Apropiacion.datos[0]["registro_plan_adquisiciones-actividad"].forEach(function (item) {
              if (item.actividad.MetaId.Id == $scope.d_metasActividades.meta) {
                const actividadSchema = {
                  actividad_id: item.actividad.Id.toString(),
                  actividad: item.actividad.Nombre,
                  valor_actividad: item.Valor,
                };

                if (self.gridOptions.data.length > 0) {
                  self.gridOptions.data.forEach(function (uniqueActividad) {
                    if (uniqueActividad.actividad_id !== actividadSchema.actividad_id) {
                      self.gridOptions.data.push(actividadSchema);
                    }
                  });
                } else {
                  self.gridOptions.data.push(actividadSchema);
                }

                self.gridOptions.data = Array.from(
                  new Set(self.gridOptions.data)
                );
              };
            });
          } catch (error) {
            swal({
              title: "Error Actividades",
              type: "error",
              text: "No se ha podido acceder a las actividades del plan de adquisiciones" + error.message,
              showCloseButton: true,
              confirmButtonText: $translate.instant("CERRAR"),
            });
          } finally {
            self.gridOptions.data = Array.from(
              new Set(self.gridOptions.data)
            );
          }
        };

        // se observa cambios en actividades para seleccionar las respectivas filas en la tabla
        $scope.$watch("actividades", function () {
          $scope.actividades ? $scope.actividades.forEach(function (act) {
            var tmp = self.gridOptions.data.filter(function (e) {
              return e.actividad_id !== act.ActividadId;
            });
            if (tmp.length > 0) {
              self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
            }
          })
            : _;
          self.actividades = $scope.actividades;
        });

        $scope.$watch(
          "[d_metasActividades.gridOptions.paginationPageSize, d_metasActividades.gridOptions.data]",
          function () {
            if (
              ((self.gridOptions.data.length <=
                self.gridOptions.paginationPageSize) ||
                self.gridOptions.paginationPageSize === null) &&
              self.gridOptions.data.length > 0
            ) {
              $scope.gridHeight =
                self.gridOptions.rowHeight * 2 +
                self.gridOptions.data.length * self.gridOptions.rowHeight;
              if (self.gridOptions.data.length <= 5) {
                self.gridOptions.enablePaginationControls = false;
              }
            } else {
              $scope.gridHeight =
                self.gridOptions.rowHeight * 3 +
                self.gridOptions.paginationPageSize *
                self.gridOptions.rowHeight;
              self.gridOptions.enablePaginationControls = true;
            }
          },
          true
        );
      },
      controllerAs: "d_metasActividades",
    };
  });
