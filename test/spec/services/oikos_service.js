'use strict';

describe('Service: oikosService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var oikosService;
  beforeEach(inject(function (_oikosService_) {
    oikosService = _oikosService_;
  }));

  it('should do something', function () {
    expect(!!oikosService).toBe(true);
  });

});
