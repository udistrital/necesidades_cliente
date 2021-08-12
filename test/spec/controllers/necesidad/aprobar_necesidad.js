'use strict';

describe('Controller: NecesidadAprobarNecesidadCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var NecesidadAprobarNecesidadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NecesidadAprobarNecesidadCtrl = $controller('NecesidadAprobarNecesidadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NecesidadAprobarNecesidadCtrl.awesomeThings.length).toBe(3);
  });
});
