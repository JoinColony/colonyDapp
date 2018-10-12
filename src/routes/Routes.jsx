/* @flow */

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import withContext from '~context/withContext';

import CreateColonyWizard from '~dashboard/CreateColonyWizard';
import ColonyHome from '~dashboard/ColonyHome';
import Dashboard from '~dashboard/Dashboard';
import Inbox from '~dashboard/Inbox';

import WalletStart from '~wallet/WalletStart';
import ConnectWallet from '~wallet/ConnectWallet';
import CreateWalletWizard from '~wallet/CreateWalletWizard';
import ProfileCreate from '~wallet/ProfileCreate';

import UserProfile from '~users/UserProfile';
import UserProfileEdit from '~users/UserProfileEdit';

import AdminProfile from '../modules/admin/components/Profile';

import {
  COLONY_HOME_ROUTE,
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
  ADMIN_PROFILE_EDIT,
} from './routeConstants';

import ConnectedOnlyRoute from './ConnectedOnlyRoute.jsx';
import DisconnectedOnlyRoute from './DisconnectedOnlyRoute.jsx';

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
        path={COLONY_HOME_ROUTE}
        component={ColonyHome}
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
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={ADMIN_PROFILE_EDIT}
        component={AdminProfile}
      />
    </Switch>
  );
};

export default withContext(Routes);
