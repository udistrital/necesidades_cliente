'use strict';

describe('Directive: plantillas/textoEnriquecido', function () {

  // load the directive's module
  beforeEach(module('contractualClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<plantillas/texto-enriquecido></plantillas/texto-enriquecido>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the plantillas/textoEnriquecido directive');
  }));
});
