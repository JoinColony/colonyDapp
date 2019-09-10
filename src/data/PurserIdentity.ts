/**
 * @todo Create `orbit-db-identity-provider-purser` package
 */

import { Identity } from '~types/index';
import PurserIdentityProvider from './PurserIdentityProvider';

class PurserIdentity implements Identity {
  readonly id: string;

  readonly provider: PurserIdentityProvider<any>;

  readonly publicKey: string;

  readonly signatures: {
    id: string;
    publicKey: string;
  };

  readonly type: string;

  constructor(
    id: string,
    publicKey: string,
    idSignature: string,
    pubKeyIdSignature: string,
    type: string,
    provider: PurserIdentityProvider<any>,
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

    this.id = id;
    this.provider = provider;
    this.publicKey = publicKey;
    this.signatures = {
      id: idSignature,
      publicKey: pubKeyIdSignature,
    };
    this.type = type;
  }

  toJSON() {
    return {
      id: this.id,
      publicKey: this.publicKey,
      signatures: this.signatures,
      type: this.type,
    };
  }
}

export default PurserIdentity;
