'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:PdfnecesidadCtrl
 * @description
 * # PdfnecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('PdfnecesidadCtrl', function (pdfMakerNecesidadesService, $scope, $routeParams, necesidadService) {
    var self = this;
    $scope.IdNecesidad = $routeParams.IdNecesidad;

    self.generarNecesidad = function (IdNecesidad) {
      necesidadService.getFullNecesidad(IdNecesidad).then(function (trNecesidad) {
        trNecesidad=trNecesidad.data.Body;
        $scope.trNecesidad = trNecesidad;
        pdfMakerNecesidadesService.docDefinition(trNecesidad).then(function (docDefinition) {
          var a = pdfMake.createPdf(docDefinition);
          a.getDataUrl(function (outDoc) {
            document.querySelector('#vistaPDF').src = outDoc;
          });
        });
      });
    };
    self.generarNecesidad($scope.IdNecesidad);

  });
