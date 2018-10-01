// @flow
import type { OrbitKVStore, UserProfileType } from '../types';

class UserProfile {
  _store: OrbitKVStore;

  constructor(store: OrbitKVStore) {
    this._store = store;
    this.initialize();
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async setProperty(property: string, value: any) {
    await this.initialize();
    let prop = this._store.get(property);
    if (Array.isArray(prop)) {
      prop.push(value);
    } else {
      prop = value;
    }

    await this._store.put(property, prop);
  }

  async getProperty(property: string) {
    await this.initialize();
    return this._store.get(property);
  }

  async setWholeProfile(properties: UserProfileType) {
    await this.initialize();
    const keys = Object.keys(properties);
    keys.forEach(key => this._store.put(key, properties[key]));
  }

  async getWholeProfile(): UserProfileType {
    await this.initialize();
    const name = this._store.get('name');
    const bio = this._store.get('bio');
    const avatarHash = this._store.get('avatar');
    const colonies = this._store.get('colonies');
    const tasks = this._store.get('tasks');
    return { name, bio, avatarHash, colonies, tasks };
  }

  address() {
    return this._store.address;
  }

  subscribe(f: Function) {
    this._store.events.on('replicated', () => {
      f({ profile: this.getWholeProfile() });
    });
  }

  async initialize() {
    if (this.intialized) return;
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
      await this._store.put('colonies', []);
      await this._store.put('tasks', []);
      await this._store.put('name', 'unset');
      await this._store.put('bio', 'unset');
    }
    this.initialized = true;
  }
}

export default UserProfile;
