/* @flow */
import React from 'react';
import routes from './routes';

import WalletConnectTemplate from '../../../pages/WalletConnectTemplate';

type Props = {
  match: {
    url: string,
  },
};

const loadComponentFromRoute = (providerSlug: string) => {
  const walletRoute =
    routes.find(route => `/${route.slug}` === providerSlug) || {};
  return walletRoute.component;
};

const ConnectWallet = ({ match }: Props) => {
  const ProviderComponent = loadComponentFromRoute(match.url);
  return (
    <WalletConnectTemplate>
      <ProviderComponent />
    </WalletConnectTemplate>
  );
};

export default ConnectWallet;
