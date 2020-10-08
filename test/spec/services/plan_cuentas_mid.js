'use strict';

describe('Service: planCuentasMid', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var planCuentasMid;
  beforeEach(inject(function (_planCuentasMid_) {
    planCuentasMid = _planCuentasMid_;
  }));

  it('should do something', function () {
    expect(!!planCuentasMid).toBe(true);
  });

});
