
'use strict';

describe('Controller: SolicitudNecesidadCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var NecesidadSolicitudNecesidadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolicitudNecesidadCtrl = $controller('SolicitudNecesidadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SolicitudNecesidadCtrl.awesomeThings.length).toBe(3);
  });
});
