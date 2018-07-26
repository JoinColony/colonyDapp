/// @flow

import type { IPFSHash, OrbitKVStore, Pot, Task } from '../types';

class Domain {
  async addTask(task: Task) {
    await this.initialize();
    if (!task.comments) {
      task.comments = [];
    }
    const tasks = await this._store.get('tasks');
    tasks.push(task);
    await this._store.put('tasks', tasks);
  }

  async getTasks() {
    await this.initialize();
    return this._store.get('tasks');
  }

  async setSpec() {}
  async getSpec() {}

  async setTitle() {}
  async getTitle() {}

  async addComment(taskID: string, comment: IPFSHash) {
    await this.initialize();
    const tasks = await this.getTasks();

    const task = tasks.filter(t => t._id === taskID)[0];

    task.comments.push(comment);
    await this._store.put('tasks', tasks);
  }

  async getComments(taskID: string) {
    await this.initialize();
    const tasks = await this.getTasks();
    const task = tasks.filter(t => t._id === taskID)[0];

    return task.comments;
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
