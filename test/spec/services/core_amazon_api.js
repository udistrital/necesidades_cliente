'use strict';

describe('Service: coreAmazonApi', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var coreAmazonApi;
  beforeEach(inject(function (_coreAmazonApi_) {
    coreAmazonApi = _coreAmazonApi_;
  }));

  it('should do something', function () {
    expect(!!coreAmazonApi).toBe(true);
  });

});
