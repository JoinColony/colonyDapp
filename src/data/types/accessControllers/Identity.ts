import { IdentityProvider } from './IdentityProvider';

interface Signatures {
  id: string; // The 'wallet signature' (the Ethereum account address, signed by Orbit's key)
  publicKey: string; // The opposite: the Orbit key's public key plus the previous signature (concatenated and signed)
}

export interface IdentityObject {
  id: string; // IPFS ID
  publicKey: string; // Orbit public key
  signatures: Signatures;
  type: string; // Provider type
}

export interface Identity {
  readonly id: string;
  readonly provider: IdentityProvider<Identity>;
  readonly publicKey: string;
  readonly signatures: Signatures;
  readonly type: string;
  toJSON(): IdentityObject;
}
