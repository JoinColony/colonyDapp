/* @flow */

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import CreateColonyWizard from '~dashboard/CreateColonyWizard';
import Dashboard from '~dashboard/Dashboard';
import WalletStart from '~wallet/WalletStart';
import ConnectWallet from '~wallet/ConnectWallet';
import CreateWalletWizard from '~wallet/CreateWalletWizard';
import UserProfile from '~users/UserProfile';
import UserProfileEdit from '~users/UserProfileEdit';
import ProfileCreate from '~wallet/ProfileCreate';
import withContext from '~context/withContext';

import {
  CONNECT_WALLET_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_PROFILE_ROUTE,
  CREATE_WALLET_ROUTE,
  DASHBOARD_ROUTE,
  INBOX_ROUTE,
  START_ROUTE,
  USER_EDIT_ROUTE,
  USER_ROUTE,
  WALLET_ROUTE,
} from './routeConstants';

import ConnectedOnlyRoute from './ConnectedOnlyRoute.jsx';
import DisconnectedOnlyRoute from './DisconnectedOnlyRoute.jsx';

// XXX These are placeholders and will be replaced soon
const Inbox = () => <h1 style={{ fontSize: '32px' }}>Inbox</h1>;
const Wallet = () => <h1 style={{ fontSize: '32px' }}>Wallet</h1>;

const Routes = ({
  context: {
    currentWallet: { instance },
  },
}: Object) => {
  const isConnected = !!instance;
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <Redirect to={isConnected ? DASHBOARD_ROUTE : START_ROUTE} />
        )}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        path={START_ROUTE}
        component={WalletStart}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        path={CONNECT_WALLET_ROUTE}
        component={ConnectWallet}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        path={CREATE_WALLET_ROUTE}
        component={CreateWalletWizard}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={INBOX_ROUTE}
        component={Inbox}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={WALLET_ROUTE}
        component={Wallet}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={DASHBOARD_ROUTE}
        component={Dashboard}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={CREATE_COLONY_ROUTE}
        component={CreateColonyWizard}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_ROUTE}
        component={UserProfile}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_EDIT_ROUTE}
        component={UserProfileEdit}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={CREATE_PROFILE_ROUTE}
        component={ProfileCreate}
      />
    </Switch>
  );
};

export default withContext(Routes);
