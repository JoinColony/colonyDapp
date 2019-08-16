const createMockOrbitStore = (sandbox): any => ({
  _addOperation: sandbox.fn(),
  _oplog: { length: 0 },
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
    on: sandbox.fn(),
    off: sandbox.fn(),
    once: sandbox.fn(),
  },
});

export default createMockOrbitStore;
