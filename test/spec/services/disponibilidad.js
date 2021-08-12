'use strict';

describe('Service: disponibilidad', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var disponibilidad;
  beforeEach(inject(function (_disponibilidad_) {
    disponibilidad = _disponibilidad_;
  }));

  it('should do something', function () {
    expect(!!disponibilidad).toBe(true);
  });

});
