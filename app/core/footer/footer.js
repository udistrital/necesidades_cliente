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
        link: '',
        value: ['Lunes a viernes', '8am a 5pm']
      }, {
        title: 'Nombre',
        class: 'globe',
        link: '',
        value: ['Sistema Integrado de informática y  Telecomunicaciones '],
      }, {
        title: 'Phone',
        class: 'call',
        link: 'tel:0313239300',
        value: ['323 93 00','Ext. 1112'],
      }, {
        title: 'Direccion',
        class: 'pin',
        link: 'https://goo.gl/maps/wURvmjEDR32YDe5z7',
        value: ['Cra 8 # 40-78','Piso 1'] 
      }, {
        title:'mail',
        class:'at',
        link: 'mailto:computo@udistrital.edu.co',
        value:['computo@udistrital.edu.co']
      }
    ]
});