// @flow
import type { OrbitKVStore } from '../types';

class UserProfile {
  _store: OrbitKVStore;

  constructor(store: OrbitKVStore) {
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

  async joinColony(colonyHash: string) {
    const colonies = this._store.get('colonies');
    colonies.push(colonyHash);
    await this._store.put('colonies', colonies);
  }

  getName() {
    return this._store.get('name');
  }

  address() {
    return this._store.address;
  }

  subscribe(f: Function) {
    this._store.events.on('replicated', () => {
      f({ name: this.getName() });
    });
  }
}

export default UserProfile;
