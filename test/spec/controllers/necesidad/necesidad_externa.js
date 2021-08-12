'use strict';

describe('Controller: NecesidadNecesidadExternaCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var NecesidadNecesidadExternaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NecesidadNecesidadExternaCtrl = $controller('NecesidadNecesidadExternaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NecesidadNecesidadExternaCtrl.awesomeThings.length).toBe(3);
  });
});
