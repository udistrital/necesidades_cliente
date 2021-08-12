'use strict';

describe('Service: amazon', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var amazon;
  beforeEach(inject(function (_amazon_) {
    amazon = _amazon_;
  }));

  it('should do something', function () {
    expect(!!amazon).toBe(true);
  });

});
