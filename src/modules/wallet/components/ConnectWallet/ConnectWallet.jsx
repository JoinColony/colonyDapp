/* @flow */
import React, { createElement } from 'react';
import styles from './ConnectWallet.jsx';
import { compose } from 'recompose';
import withProvider from './';
import routes from './routes';

type Props = {
  match: {
    url: string
  }
}

const loadComponentFromRoute = (providerSlug: string) => {
  const walletRoute = routes.find(walletRoute => `/${walletRoute.slug}` === providerSlug) || {}
  return walletRoute.component;
}

const ConnectWallet = ({match}: Props) => {

  const child = loadComponentFromRoute(match.url);

  return withProvider({ProviderComponent: child});
}

export default ConnectWallet;
