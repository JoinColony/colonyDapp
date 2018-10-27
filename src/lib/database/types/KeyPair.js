/* @flow */

export type KeyPair = {
  getPublic: (encoding?: string) => string,
  getPrivate: (encoding?: string) => string,
};
