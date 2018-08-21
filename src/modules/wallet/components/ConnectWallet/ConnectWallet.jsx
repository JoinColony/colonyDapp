/* @flow */
import type { ContextRouter } from 'react-router-dom';

import React, { Fragment } from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Link, withRouter } from 'react-router-dom';

import styles from './ConnectWallet.css';

import routes from './routes';

import Logo from '../../../../img/logo.svg';

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

const ConnectWallet = ({ match }: Props) => {
  const ProviderComponent = enhance(loadComponentFromRoute(match.url));
  return (
    <Fragment>
      <header className={styles.header}>
        <figure className={styles.logo} role="presentation">
          <Link to="/">
            <Logo />
          </Link>
        </figure>
      </header>
      <div className={styles.mainContent}>
        <div>
          <ProviderComponent />
        </div>
      </div>
    </Fragment>
  );
};

export default ConnectWallet;
