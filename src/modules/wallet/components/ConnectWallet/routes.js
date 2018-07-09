/* @flow */

import type { ComponentType } from 'react';

import Hardware from './Hardware';
import JSONUpload from './JSONUpload';
import MetaMask from './MetaMask';
import Mnemonic from './Mnemonic';

type Route = {
  component: ComponentType<any>,
  slug: string,
};

type Routes = Array<Route>

export const CONNECT_WALLET_SLUG_HARDWARE = 'create-wallet/hardware';
export const CONNECT_WALLET_SLUG_JSON = 'create-wallet/json';
export const CONNECT_WALLET_SLUG_METAMASK = 'create-wallet/metamask';
export const CONNECT_WALLET_SLUG_MNEMONIC = 'create-wallet/mnemonic';

const connectWalletRoutes: Routes = [
  {
    component: Hardware,
    slug: CONNECT_WALLET_SLUG_HARDWARE,
  },
  {
    component: JSONUpload,
    slug: CONNECT_WALLET_SLUG_JSON,
  },
  {
    component: MetaMask,
    slug: CONNECT_WALLET_SLUG_METAMASK,
  },
  {
    component: Mnemonic,
    slug: CONNECT_WALLET_SLUG_MNEMONIC,
  },
]

export default connectWalletRoutes;