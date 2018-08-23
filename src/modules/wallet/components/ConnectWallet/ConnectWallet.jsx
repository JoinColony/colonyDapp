/* @flow */
import type { ContextRouter } from 'react-router-dom';

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import WizardTemplate from '../../../pages/WizardTemplate';

import styles from './ConnectWallet.css';

import routes from './routes';

const loadComponentFromRoute = (providerSlug: string) => {
  const walletRoute =
    routes.find(route => `/${route.slug}` === providerSlug) || {};
  return walletRoute.component;
};

const enhance = compose(
  withRouter,
  withState('isConnected', 'setIsConnected', false),
  withHandlers({
    handleDidConnectWallet: (props: ContextRouter) => () => {
      const { history } = props;
      history.push('/');
    },
    handleExit: (props: ContextRouter) => () => {
      const { history } = props;
      history.push('/start');
    },
  }),
);

const ConnectWallet = ({ history, match }: ContextRouter) => {
  const providerComponent = loadComponentFromRoute(match.url);
  if (!providerComponent) {
    history.push('/');
  }
  const ProviderComponent = enhance(providerComponent);
  return (
    <WizardTemplate>
      <div className={styles.connectContainer}>
        <ProviderComponent />
      </div>
    </WizardTemplate>
  );
};

export default ConnectWallet;
