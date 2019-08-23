import OrbitDBKeystore from 'orbit-db-keystore';
import { Identity } from './Identity';

export interface IdentityProvider<T extends Identity> {
  readonly keystore: OrbitDBKeystore;
  readonly type: string;
  createIdentity(): Promise<T>;
  sign(identity: T, data: any): Promise<string>;
  verify(signature: string, publicKey: string, data: any): Promise<boolean>;
  close(): Promise<void>;
}
