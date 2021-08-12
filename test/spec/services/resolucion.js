'use strict';

describe('Service: resolucion', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var resolucion;
  beforeEach(inject(function (_resolucion_) {
    resolucion = _resolucion_;
  }));

  it('should do something', function () {
    expect(!!resolucion).toBe(true);
  });

});
