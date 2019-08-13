'use strict';

describe('Service: planCuentasService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var planCuentasService;
  beforeEach(inject(function (_planCuentasService_) {
    planCuentasService = _planCuentasService_;
  }));

  it('should do something', function () {
    expect(!!planCuentasService).toBe(true);
  });

});
