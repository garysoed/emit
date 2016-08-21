import {TestDispose, TestSetup} from '../external/gs_tools/src/testing';

let angular = {};
angular['component'] = function(): any {
  return angular;
};

angular['config'] = function(): any {
  return angular;
};

angular['directive'] = function(): any {
  return angular;
};

angular['module'] = function(): any {
  return angular;
};

angular['provider'] = function(): any {
  return angular;
};

angular['service'] = function(): any {
  return angular;
};

window['angular'] = angular;


let called = false;
const TEST_SETUP = new TestSetup([
  TestDispose,
]);

export default {
  config(): void {
    if (!called) {
      TEST_SETUP.setup();
    }
  },
}
