'use strict';

describe('Service: parametrosgobiernoService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var parametrosgobiernoService;
  beforeEach(inject(function (_parametrosgobiernoService_) {
    parametrosgobiernoService = _parametrosgobiernoService_;
  }));

  it('should do something', function () {
    expect(!!parametrosgobiernoService).toBe(true);
  });

});
