/* @flow */

/* TODO: I guess this should eventually live in its own package
 * orbit-db-identity-provider-purser (?)
 */

import Keystore from 'orbit-db-keystore';

import type { Identity } from './Identity';

import PurserIdentityProvider from './PurserIdentityProvider';

class PurserIdentity implements Identity {
  _id: string;

  _idSignature: string;

  _keystore: Keystore;

  _provider: PurserIdentityProvider;

  _publicKey: string;

  _pubKeyIdSignature: string;

  _signatures: {
    id: string,
    publicKey: string,
  };

  _type: string;

  constructor(
    id: string,
    publicKey: string,
    idSignature: string,
    pubKeyIdSignature: string,
    type: string,
    provider: PurserIdentityProvider,
  ) {
    if (!id) {
      throw new Error('Identity id is required');
    }

    if (!publicKey) {
      throw new Error('Invalid public key');
    }

    if (!idSignature) {
      throw new Error('Signature of the id (idSignature) is required');
    }

    if (!pubKeyIdSignature) {
      throw new Error('Signature of (publicKey + idSignature) is required');
    }

    if (!type) {
      throw new Error('Identity type is required');
    }

    if (!provider) {
      throw new Error('Identity provider is required');
    }

    this._id = id;
    this._keystore = Keystore.create();
    this._provider = provider;
    this._publicKey = publicKey;
    this._signatures = {
      id: idSignature,
      publicKey: pubKeyIdSignature,
    };
    this._type = type;
  }

  /**
   * This is only used as a fallback to the clock id when necessary
   * @return {string} public key hex encoded
   */
  get id() {
    return this._id;
  }

  get publicKey() {
    return this._publicKey;
  }

  get signatures() {
    return this._signatures;
  }

  get type() {
    return this._type;
  }

  get provider() {
    return this._provider;
  }

  toJSON() {
    return {
      id: this._id,
      publicKey: this._publicKey,
      signatures: this._signatures,
      type: this._type,
    };
  }
}

export default PurserIdentity;
