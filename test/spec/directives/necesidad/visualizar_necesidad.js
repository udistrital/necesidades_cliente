'use strict';

describe('Directive: necesidad/visualizarNecesidad', function () {

  // load the directive's module
  beforeEach(module('contractualClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<necesidad/visualizar-necesidad></necesidad/visualizar-necesidad>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the necesidad/visualizarNecesidad directive');
  }));
});
