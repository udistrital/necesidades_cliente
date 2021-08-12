'use strict';

describe('Service: wso2GeneralService', function () {

  // load the service's module
    beforeEach(module('contractualClienteApp'));

  // instantiate service
    var wso2GeneralService;
    beforeEach(inject(function (_wso2GeneralService_) {
      wso2GeneralService = _wso2GeneralService_;
    }));

    it('should do something', function () {
      expect(!!wso2GeneralService).toBe(true);
    });

});
