// @flow
import type { OrbitKVStore, Pot } from '../types';

class Colony {
  async addDomain(domainHash: string) {
    await this.initialize();
    const domains = await this.getDomains();
    domains.push(domainHash);
    await this._store.put('domains', domains);
  }

  async getDomains() {
    await this.initialize();
    const domains = this._store.get('domains');
    return domains;
  }

  async addMember(userKey: string) {
    await this.initialize();
    const members = this._store.get('members');
    members.push(userKey);
    await this._store.put('members', members);
  }

  async getMembers() {
    return this._store.get('members');
  }

  async setTokenBalance(tokenName: string, amount: number) {
    await this.initialize();
    const pot = this._store.get('pot');
    pot[tokenName] = amount;
    await this._store.put('pot', pot);
  }

  async setPot(pot: Pot) {
    await this.initialize();
    await this._store.put('pot', pot);
  }

  async getPot() {
    await this.initialize();
    return this._store.get('pot');
  }

  async setAvatar(avatarHash: string) {
    await this.initialize();
    await this._store.put('avatar', avatarHash);
  }

  async getAvatar() {
    await this.initialize();
    const avatarHash = await this._store.get('avatar');
    return avatarHash;
  }

  address() {
    return this._store.address;
  }

  async allProperties() {
    await this.initialize();
    const avatarHash = this._store.get('avatar');
    const pot = this._store.get('pot');
    const domains = this._store.get('domains');
    const members = this._store.get('members');
    return { avatarHash, pot, domains, members };
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async initialize() {
    if (this.intialized) return;
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
      await this._store.put('domains', []);
      await this._store.put('members', []);
      await this._store.put('pot', {});
    }
    this.initialized = true;
  }

  _store: OrbitKVStore;

  constructor(store: OrbitKVStore) {
    this._store = store;
    this.initialize();
  }
}

export default Colony;
