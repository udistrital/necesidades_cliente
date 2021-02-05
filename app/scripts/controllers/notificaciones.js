'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NotificacionesCtrl
 * @description
 * # NotificacionesCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('NotificacionesCtrl', function($scope, notificacion) {
    $scope.imagePath = 'images/yeoman.png';
    $scope.notificacion = notificacion;
  });
