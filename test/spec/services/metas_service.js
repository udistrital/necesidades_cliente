'use strict';

describe('Service: metasService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var metasService;
  beforeEach(inject(function (_metasService_) {
    metasService = _metasService_;
  }));

  it('should do something', function () {
    expect(!!metasService).toBe(true);
  });

});
