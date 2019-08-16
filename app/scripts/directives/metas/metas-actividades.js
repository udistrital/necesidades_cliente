'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:metasActividades
 * @description
 * # metasActividades
 */
angular.module('contractualClienteApp')
  .directive('metasActividades', function (metasRequest) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      
      templateUrl: '/views/directives/metas/metas-actividades.html',
      controller:function($scope){
        var self = this;
        self.metas=[];
        metasRequest.get('Metas').then(
          function(res) {
            self.metas=res.data;
          }
        )
      },
      controllerAs:'d_metasActividades'
    };
  });
