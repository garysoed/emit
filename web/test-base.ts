import TestDispose from '../node_modules/gs-tools/src/testing/test-dispose';
import TestSetup from '../node_modules/gs-tools/src/testing/test-setup';

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
