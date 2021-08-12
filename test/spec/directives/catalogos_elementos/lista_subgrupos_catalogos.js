'use strict';

describe('Directive: catalogosElementos/listaSubgruposCatalogos', function () {

  // load the directive's module
  beforeEach(module('contractualClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<catalogos-elementos/lista-subgrupos-catalogos></catalogos-elementos/lista-subgrupos-catalogos>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the catalogosElementos/listaSubgruposCatalogos directive');
  }));
});
