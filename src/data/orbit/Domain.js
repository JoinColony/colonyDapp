/// @flow

import type { IPFSHash, OrbitKVStore, Task } from '../types';

class Domain {
  async addTask(task: Task) {
    await this.initialize();
    const tasks = await this.getDomains();
    tasks.push(domainHash);
    await this._store.put('tasks', domains);
  }

  async getTasks() {
    await this.initialize();
    return this._store.get('tasks');
  }

  async setSpec() {}
  async getSpec() {}

  async setTitle() {}
  async getTitle() {}

  async addComment(comment: IPFSHash) {
    await this.initialize();
    const comments = this._store.get('comments');
    comments.push(comment);
    await this._store.put('comments', comments);
  }

  async getCommentHashes() {
    await this.initialize();
    return this._store.get('comments');
  }

  async setBounty(bounty: Pot) {
    await this.initialize();
    await this._store.put('bounty', bounty);
  }

  address() {
    return this._store.address;
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async initialize() {
    if (this.intialized) return;
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
      await this._store.put('tasks', []);
    }
    this.initialized = true;
  }

  _store: OrbitKVStore;

  constructor(store: OrbitKVStore) {
    this._store = store;
    this.initialize();
  }
}

export default Domain;
