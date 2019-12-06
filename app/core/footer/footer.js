'use strict';
/**
 * @ngdoc function
 * @name core.controller:footerCtrl
 * @description
 * # footerCtrl
 * Controller of the core
 */
angular.module('core')
.controller("footerCtrl", function($scope) {
    //var ctrl = this;
    $scope.list = [{
        title: 'Horario',
        class: 'time',
        value: ['Lunes a viernes', '8am a 5pm']
      }, {
        title: 'Nombre',
        class: 'globe',
        value: ['Sistema Integrado de informática y  Telecomunicaciones '],
      }, {
        title: 'Phone',
        class: 'call',
        value: ['323 93 00','Ext. 1112'],
      }, {
        title: 'Direccion',
        class: 'pin',
        value: ['Cra 8 # 40-78','Piso 1'] 
      }, {
        title:'mail',
        class:'at',
        value:['computo@udistrital.edu.co']
      }
    ]
});