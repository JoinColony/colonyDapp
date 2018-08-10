/* @flow */
import React from 'react';
import routes from './routes';
import { compose, withHandlers, withState } from 'recompose';
import { withRouter } from 'react-router';

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

const enhance = compose(
  withRouter,
  withState('isConnected', 'setIsConnected', false),
  withHandlers({
    handleDidConnectWallet: props => () => {
      const { history } = props;
      history.push('/');
    },
    handleExit: props => () => {
      const { history } = props;
      history.push('/start');
    },
  }),
);

const ConnectWallet = ({ match }: Props) => {
  const ProviderComponent = enhance(loadComponentFromRoute(match.url));
  return (
    <WalletConnectTemplate>
      <ProviderComponent />
    </WalletConnectTemplate>
  );
};

export default ConnectWallet;
