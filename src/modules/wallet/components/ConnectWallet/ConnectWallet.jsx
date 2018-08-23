/* @flow */
import type { ContextRouter } from 'react-router-dom';

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Link, withRouter } from 'react-router-dom';

import styles from './ConnectWallet.css';

import routes from './routes';

import Logo from '../../../../img/logo.svg';

type Props = ContextRouter;

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

const ConnectWallet = ({ history, match }: Props) => {
  const providerComponent = loadComponentFromRoute(match.url);
  if (!providerComponent) {
    history.push('/');
  }
  const ProviderComponent = enhance(providerComponent);
  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <figure className={styles.logo} role="presentation">
          <Link to="/">
            <Logo />
          </Link>
        </figure>
      </header>
      <div className={styles.mainContent}>
        <div className={styles.contentInner}>
          <ProviderComponent />
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
