'use strict';

describe('Service: solicitudRp/solicitudRpGridService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var solicitudRp,solicitudRpGridService;
  beforeEach(inject(function (_solicitudRp/solicitudRpGridService_) {
    solicitudRp/solicitudRpGridService = _solicitudRp/solicitudRpGridService_;
  }));

  it('should do something', function () {
    expect(!!solicitudRp/solicitudRpGridService).toBe(true);
  });

});
