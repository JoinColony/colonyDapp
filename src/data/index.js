/* @flow */

class UserProfile {
  name: string;
  is_empty: boolean;

  constructor() {
    this.name = undefined;
    this.is_empty = true;
  }

  isEmpty(): boolean {
    return this.is_empty;
  }

  setName(name: string) {
    this.name = name;
    this.is_empty = false;
  }
}

export default class Data {
  static fromDefaultConfig() {
    return new Data();
  }

  async getUserProfile(string: key): UserProfile {
    return new UserProfile();
  }
}
