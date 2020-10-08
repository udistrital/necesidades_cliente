'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiacion/fuenteFinanciacionNecesidad
 * @description
 * # apropiacion/fuenteFinanciacionNecesidad
 */
angular.module('contractualClienteApp')
  .directive('fuenteFinanciacionNecesidad', function (administrativaRequest,financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          necesidad: '=',
          resumenafectacion: '='
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_necesidad.html',
      controller:function($scope){
        var self = this;
        $scope.resumenafectacion = [];
        $scope.mostrar_titulo = false;
        $scope.$watch('apropiacion', function(){

          $scope.resumenafectacion = [];
          if ($scope.necesidad !== undefined && $scope.apropiacion !== undefined){
            $scope.mostrar_titulo = true;
            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              administrativaRequest.get('fuente_financiacion_rubro_necesidad',$.param({
                query: "Necesidad.Id:"+$scope.necesidad+",Apropiacion:"+apropiacion_data,
                limit: -1
              })).then(function(response) {
                self.rubros_afectados = response.data;
                angular.forEach(self.rubros_afectados, function(rubros_data) {
                  financieraRequest.get('apropiacion',$.param({
                    query: "Id:"+rubros_data.Apropiacion,
                    limit: 1
                  })).then(function(response) {
                    rubros_data.Apropiacion = response.data[0];
                  });
                  financieraRequest.get('fuente_financiamiento',$.param({
                    query: "Id:"+rubros_data.FuenteFinanciamiento,
                    limit: 1
                  })).then(function(response) {
                    if (response.data === null){
                      rubros_data.FuenteFinanciamiento = {Id:0};
                    }else{
                      rubros_data.FuenteFinanciamiento = response.data[0];

                    }

                  });
                });
                $scope.resumenafectacion.push(self.rubros_afectados);
              });

            });
          }

        },true);
      },
      controllerAs:'fuenteFinanciacionNecesidad'
    };
  });
