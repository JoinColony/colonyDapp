// @flow
import type { OrbitKVStore, UserProfileType } from '../types';

class UserProfile {
  _store: OrbitKVStore;
  initialized: boolean;

  constructor(store: OrbitKVStore) {
    this._store = store;
    this.initialize();
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async setProperty(property: string, value: any) {
    await this.initialize();
    if (property === 'profile') {
      return this.setWholeProfile(value);
    }

    let prop = this.getProperty(property);
    if (Array.isArray(prop)) {
      prop.push(value);
    } else {
      prop = value;
    }

    await this._store.put(property, prop);
    return prop;
  }

  async getProperty(property: string) {
    await this.initialize();
    return this._store.get(property);
  }

  async setWholeProfile(properties: UserProfileType) {
    await this.initialize();
    Object.keys(properties).forEach(key =>
      this._store.put(key, properties[key]),
    );
    return properties;
  }

  async getWholeProfile(): Promise<UserProfileType> {
    await this.initialize();
    const name = this._store.get('name');
    const bio = this._store.get('bio');
    const avatar = this._store.get('avatar');
    const colonies = this._store.get('colonies');
    const tasks = this._store.get('tasks');
    const ensName = this._store.get('ensName');
    const location = this._store.get('location');
    const walletAddress = this._store.get('walletAddress');
    const website = this._store.get('website');
    return {
      name,
      bio,
      avatar,
      colonies,
      tasks,
      ensName,
      location,
      walletAddress,
      website,
    };
  }

  get address() {
    return this._store.address;
  }

  subscribe(f: Function) {
    this._store.events.on('replicated', () => {
      f({ profile: this.getWholeProfile() });
    });
  }

  async initialize() {
    if (this.initialized) return;
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
      await this._store.put('colonies', []);
      await this._store.put('tasks', []);
      await this._store.put('name', 'unset');
      await this._store.put('bio', 'unset');
      await this._store.put('avatar', 'unset');
      await this._store.put('ensName', 'unset');
      await this._store.put('location', 'unset');
      await this._store.put('walletAddress', 'unset');
      await this._store.put('website', 'unset');
    }
    this.initialized = true;
  }
}

export default UserProfile;
