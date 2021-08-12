'use strict';

describe('Service: orden', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var orden;
  beforeEach(inject(function (_orden_) {
    orden = _orden_;
  }));

  it('should do something', function () {
    expect(!!orden).toBe(true);
  });

});
