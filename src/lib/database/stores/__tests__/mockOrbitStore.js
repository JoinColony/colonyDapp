const createMockOrbitStore = sandbox => ({
  _addOperation: sandbox.fn(),
  add: sandbox.fn(),
  address: 'orbit store address',
  close: sandbox.fn(),
  drop: sandbox.fn(),
  get: sandbox.fn(),
  key: 'orbit store key',
  load: sandbox.fn(),
  put: sandbox.fn(),
  type: 'orbit store type',
  events: {
    once: sandbox.fn(),
  },
});

export default createMockOrbitStore;
