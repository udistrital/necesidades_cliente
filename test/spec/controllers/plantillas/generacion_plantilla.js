'use strict';

describe('Controller: MinutaGeneracionMinutaCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var MinutaGeneracionMinutaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MinutaGeneracionMinutaCtrl = $controller('MinutaGeneracionMinutaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MinutaGeneracionMinutaCtrl.awesomeThings.length).toBe(3);
  });
});
