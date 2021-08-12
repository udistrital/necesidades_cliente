'use strict';

describe('Controller: NecesidadVerNecesidadCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var NecesidadVerNecesidadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NecesidadVerNecesidadCtrl = $controller('NecesidadVerNecesidadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NecesidadVerNecesidadCtrl.awesomeThings.length).toBe(3);
  });
});
