'use strict';

describe('Directive: marcoLegal/listaDocumentosLegales', function () {

  // load the directive's module
  beforeEach(module('contractualClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<marco-legal/lista-documentos-legales></marco-legal/lista-documentos-legales>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the marcoLegal/listaDocumentosLegales directive');
  }));
});
