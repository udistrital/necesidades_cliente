'use strict';

describe('Service: amazonAdministrativa', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var amazonAdministrativa;
  beforeEach(inject(function (_amazonAdministrativa_) {
    amazonAdministrativa = _amazonAdministrativa_;
  }));

  it('should do something', function () {
    expect(!!amazonAdministrativa).toBe(true);
  });

});
