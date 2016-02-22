import DisposableTestSetup from '../node_modules/gs-tools/src/testing/disposable-test-setup';
import TestSetup from '../node_modules/gs-tools/src/testing/test-setup';

let called = false;
const TEST_SETUP = new TestSetup([
  DisposableTestSetup,
]);

export default {
  config(): void {
    if (!called) {
      TEST_SETUP.setup();
    }
  },
}
