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

type Routes = Array<Route>;

export const CONNECT_WALLET_SLUG_HARDWARE = 'connectwallet/hardware';
export const CONNECT_WALLET_SLUG_JSON = 'connectwallet/json';
export const CONNECT_WALLET_SLUG_METAMASK = 'connectwallet/metamask';
export const CONNECT_WALLET_SLUG_MNEMONIC = 'connectwallet/mnemonic';

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
];

export default connectWalletRoutes;
