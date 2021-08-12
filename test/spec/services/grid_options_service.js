'use strict';

describe('Service: gridOptionsService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var gridOptionsService;
  beforeEach(inject(function (_gridOptionsService_) {
    gridOptionsService = _gridOptionsService_;
  }));

  it('should do something', function () {
    expect(!!gridOptionsService).toBe(true);
  });

});
