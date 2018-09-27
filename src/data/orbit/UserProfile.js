// @flow
import type {
  IPFSHash,
  OrbitKVStore,
  profileColony,
  profileTask,
  UserProfile,
} from '../types';

class UserProfile {
  _store: OrbitKVStore;

  constructor(store: OrbitKVStore) {
    this._store = store;
    this.initialize();
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async setName(name: string) {
    await this.initialize();
    await this._store.put('name', name);
  }

  getName() {
    return this._store.get('name');
  }

  async setBio(bio: string) {
    await this.initialize();
    await this._store.put('bio', bio);
  }

  getBio() {
    return this._store.get('bio');
  }

  async setAvatar(avatar: IPFSHash) {
    await this.initialize();
    await this._store.put('avatar', avatar);
  }

  getAvatar(): IPFSHash {
    return this._store.get('avatar');
  }

  async joinColony(colony: profileColony) {
    await this.initialize();
    const colonies = this._store.get('colonies');
    colonies.push(colony);
    await this._store.put('colonies', colonies);
  }

  async addTask(task: profileTask) {
    await this.initialize();
    const tasks = await this._store.get('tasks');
    tasks.push(task);
    await this._store.put('tasks', tasks);
  }

  async getTasks(): profileTask[] {
    await this.initialize();
    return this._store.get('tasks');
  }

  async getWholeProfile(): UserProfile {
    await this.initialize();
    const name = this._store.get('name');
    const bio = this._store.get('bio');
    const avatarHash = this._store.get('avatar');
    const tasks = this._store.get('tasks');
    const colonies = this._store.get('colonies');
    return { name, bio, avatarHash, colonies, tasks };
  }

  address() {
    return this._store.address;
  }

  subscribe(f: Function) {
    this._store.events.on('replicated', () => {
      f({ name: this.getName() });
    });
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async initialize() {
    if (this.intialized) return;
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
      await this._store.put('colonies', []);
      await this._store.put('tasks', []);
    }
    this.initialized = true;
  }
}

export default UserProfile;
