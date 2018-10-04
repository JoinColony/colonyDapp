// @flow
import type { OrbitKVStore, UserProfileType } from '../types';
import { UserProfileSchema } from '../types';

const NOT_INITIALIZED_MESSAGE =
  'Please use UserProfile.create to initialize the class.';

class UserProfile {
  _store: OrbitKVStore;

  initialized: boolean;

  constructor(store: OrbitKVStore) {
    this._store = store;
  }

  static async create(store: OrbitKVStore) {
    const userProfile = new UserProfile(store);
    await userProfile.initialize();
    return userProfile;
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async setProperty(property: string, value: any) {
    let prop = this.getProperty(property);
    if (Array.isArray(prop)) {
      prop.push(value);
    } else {
      prop = value;
    }

    await this._store.put(property, prop);
    return prop;
  }

  getProperty(property: string) {
    if (!this.initialized) throw new Error(NOT_INITIALIZED_MESSAGE);
    return this._store.get(property);
  }

  async setWholeProfile(properties: UserProfileType) {
    const putPromises = Object.keys(properties).map(key =>
      this._store.put(key, properties[key]),
    );

    return Promise.all(putPromises).then(() => properties);
  }

  getWholeProfile(): Promise<UserProfileType> {
    if (!this.initialized) throw new Error(NOT_INITIALIZED_MESSAGE);

    const profile = {};
    Object.keys(UserProfileSchema).forEach(key => {
      profile[key] = this._store.get(key);
    });

    return profile;
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
      const putPromises = Object.keys(UserProfileSchema).map(key =>
        this._store.put(key, UserProfileSchema[key]),
      );
      await Promise.all(putPromises);
    }
    this.initialized = true;
  }
}

export default UserProfile;
