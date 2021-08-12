'use strict';

describe('Controller: NecesidadNecesidadesCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var NecesidadNecesidadesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NecesidadNecesidadesCtrl = $controller('NecesidadNecesidadesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NecesidadNecesidadesCtrl.awesomeThings.length).toBe(3);
  });
});
