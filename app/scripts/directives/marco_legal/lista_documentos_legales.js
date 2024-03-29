'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:marcoLegal/listaDocumentosLegales
 * @description
 * # marcoLegal/listaDocumentosLegales
 */
angular.module('contractualClienteApp')
  .directive('listaDocumentosLegales', function ($translate, necesidadesCrudRequest) {
    return {
      restrict: 'E',
      scope: {
        documentos: '='
      },

      templateUrl: 'views/directives/marco_legal/lista_documentos_legales.html',
      controller: function ($scope) {
        var self = this;
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
          columnDefs: [{
            field: 'NombreDocumento',
            displayName: $translate.instant('NOMBRE_DOCUMENTO'),
            width: '80%',
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function (row) {
              return row.entity.NombreDocumento;
            }
          },
          {
            field: 'Enlace',
            displayName: $translate.instant('VER'),
            width: '20%',
            cellTemplate: '<center><a href="{{row.entity.Enlace}}" onclick="window.open(this.href, \'\', \'resizable=yes,status=no,location=center,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=1150,height=1600\'); return false;" ><span class="fa fa-eye"></span></a></center>',
            headerCellClass: $scope.highlightFilteredHeader + ' text-info'
          }
          ]
        };

        self.gridOptions.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function () {
            $scope.documentos = self.gridApi.selection.getSelectedRows().map(function(ml){ return {MarcoLegalId : ml}});
          });

        };

        self.aniadirDoc = false;
        self.obj_documento = {
          NombreDocumento: '',
          Enlace: ''
        };

        self.loadDocumentos = function () {
          necesidadesCrudRequest.get('marco_legal', 'limit=0').then(function (response) {
            // se filtra para que no cargue documentos vacios porque hay un bug en el API que crea documentos vacios
            self.gridOptions.data = response.data.filter(function (documento) { return (documento.Enlace !== "" && documento.NombreDocumento != "") });
          }).then(function () {
            // Se inicializa el grid api para seleccionar
            self.gridApi.grid.modifyRows(self.gridOptions.data);
          });
        }

        self.loadDocumentos();

        // se observa cambios en documentos para seleccionar las respectivas filas en la tabla
        $scope.$watch('documentos', function () {
          setTimeout(function() {
            $scope.documentos.forEach(function (doc) {
              var tmp = self.gridOptions.data.filter(function (e) { return e.Id == doc.MarcoLegalId.Id})
              if (tmp.length > 0) {
                self.gridApi.selection.selectRow(tmp[0]); //seleccionar las filas
              }
            });
          },2000)
        });

        $scope.$watch('[d_listaDocumentosLegales.gridOptions.paginationPageSize, d_listaDocumentosLegales.gridOptions.data]', function () {
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


        self.HabilitarAgregarDocs = function () {
          self.aniadirDoc = !self.aniadirDoc;
        };

        self.AniadirDocumento = function () {
          if (!self.obj_documento.NombreDocumento || !self.obj_documento.Enlace || self.obj_documento.NombreDocumento==="" || self.obj_documento.Enlace==="") {
            swal({
              title: 'Error al guardar documento',
              type: 'error',
              text: 'Por favor, ingrese el nombre y el enlace del documento.',
              showCloseButton: true,
              confirmButtonText: $translate.instant("CERRAR")
          });
          return;
          }
          necesidadesCrudRequest.post("marco_legal", self.obj_documento).then(function () {
            swal({
              title: 'Documento guardado',
              type: 'success',
              text: 'Se agregó el documento '+self.obj_documento.NombreDocumento+" al repositorio de documentos.",
              showCloseButton: true,
              confirmButtonText: $translate.instant("CERRAR")
          });
          self.obj_documento = {
            NombreDocumento: '',
            Enlace: ''
          };
          self.loadDocumentos();
          }
          );


        };
      },
      controllerAs: 'd_listaDocumentosLegales'
    };
  });


