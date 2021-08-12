'use strict';

describe('Service: agoraService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var agoraService;
  beforeEach(inject(function (_agoraService_) {
    agoraService = _agoraService_;
  }));

  it('should do something', function () {
    expect(!!agoraService).toBe(true);
  });

});
