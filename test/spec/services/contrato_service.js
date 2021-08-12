'use strict';

describe('Service: contratoService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var contratoService;
  beforeEach(inject(function (_contratoService_) {
    contratoService = _contratoService_;
  }));

  it('should do something', function () {
    expect(!!contratoService).toBe(true);
  });

});
