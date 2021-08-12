'use strict';

describe('Service: nuxeoService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var nuxeoService;
  beforeEach(inject(function (_nuxeoService_) {
    nuxeoService = _nuxeoService_;
  }));

  it('should do something', function () {
    expect(!!nuxeoService).toBe(true);
  });

});
