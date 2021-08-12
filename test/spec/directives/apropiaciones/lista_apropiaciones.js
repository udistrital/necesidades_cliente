'use strict';

describe('Directive: apropiaciones/listaApropiaciones', function () {

  // load the directive's module
  beforeEach(module('contractualClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiaciones/lista-apropiaciones></apropiaciones/lista-apropiaciones>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiaciones/listaApropiaciones directive');
  }));
});
