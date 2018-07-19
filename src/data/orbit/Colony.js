// @flow
import type { OrbitKVStore } from '../types';
class Colony {
  async addDomain(domainHash: string) {
    const domains = this._store.get('domains');
    domains.push(domainHash);
    await this._store.put('domains', domains);
  }

  async addMember(userKey: string) {
    const members = this._store.get('members');
    members.push(userKey);
    await this._store.put('members', members);
  }

  async setTokenBalance(tokenName: string, amount: number) {
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
      await this._store.put('domains', []);
    }
    const pot = this._store.get('pot');
    pot[tokenName][amount] = amount;
    await this._store.put('pot', pot);
  }

  async setAvatar(avatarHash: string) {
    await this._store.put('avatar', avatarHash);
  }

  address() {
    return this._store.address;
  }

  _store: OrbitKVStore;

  constructor(store: OrbitKVStore) {
    this._store = store;
  }
}

export default Colony;
