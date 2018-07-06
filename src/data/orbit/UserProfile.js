class UserProfile {
  _store: OrbitKVStore;

  constructor(store) {
    this._store = store;
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async setName(name: string) {
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
    }
    await this._store.put('name', name);
  }

  getName() {
    return this._store.get('name');
  }

  address() {
    return this._store.address;
  }

  subscribe(f) {
    this._store.events.on('replicated', () => {
      f({ name: this.getName() });
    });
  }
}

export default UserProfile;
