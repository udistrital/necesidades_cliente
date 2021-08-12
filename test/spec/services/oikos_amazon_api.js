'use strict';

describe('Service: oikosAmazonApi', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var oikosAmazonApi;
  beforeEach(inject(function (_oikosAmazonApi_) {
    oikosAmazonApi = _oikosAmazonApi_;
  }));

  it('should do something', function () {
    expect(!!oikosAmazonApi).toBe(true);
  });

});
