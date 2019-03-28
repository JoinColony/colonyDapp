/* @flow */

import { ec as EC } from 'elliptic';
import type { KeyPair } from './types';

const ec = new EC('secp256k1');
const storage = {};

export default class Keystore {
  static getKey(id: string) {
    return storage[id];
  }

  static createKey(id: string): KeyPair {
    const key = ec.genKeyPair();
    storage[id] = key;
    return key;
  }

  static sign(key: KeyPair, data: string): string {
    if (!key) throw new Error('No signing key given');
    if (!data) throw new Error('Given input data was undefined');
    const sig = ec.sign(data, key);
    return sig.toDER('hex');
  }

  static verify(signature: string, publicKey: string, data: string): boolean {
    if (!signature) throw new Error('No signature given');
    if (!publicKey) throw new Error('Given publicKey was undefined');
    if (!data) throw new Error('Given input data was undefined');

    let isValid = false;
    const key = ec.keyPair({
      pub: publicKey,
      pubEnc: 'hex',
    });

    try {
      isValid = ec.verify(data, signature, key);
    } catch (e) {
      // Catches 'Error: Signature without r or s'
    }

    return isValid;
  }
}
