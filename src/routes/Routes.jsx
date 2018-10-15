/* @flow */

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import withContext from '~context/withContext';

import CreateColonyWizard from '~dashboard/CreateColonyWizard';
import ColonyHome from '~dashboard/ColonyHome';
import Dashboard from '~dashboard/Dashboard';

import Inbox from '~dashboard/Inbox';

import ConnectWalletWizard from '~user/ConnectWalletWizard';
import CreateWalletWizard from '~user/CreateWalletWizard';
import UserProfile from '~user/UserProfile';
import UserProfileEdit from '~user/UserProfileEdit';
import ProfileCreate from '~user/ProfileCreate';

import AdminDashboard from '~admin/AdminDashboard';

import {
  CONNECT_ROUTE,
  COLONY_HOME_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_PROFILE_ROUTE,
  CREATE_WALLET_ROUTE,
  DASHBOARD_ROUTE,
  ADMIN_DASHBOARD_ROUTE,
  INBOX_ROUTE,
  USER_EDIT_ROUTE,
  USER_ROUTE,
  WALLET_ROUTE,
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
          <Redirect to={isConnected ? DASHBOARD_ROUTE : CONNECT_ROUTE} />
        )}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        path={CONNECT_ROUTE}
        component={ConnectWalletWizard}
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
        path={ADMIN_DASHBOARD_ROUTE}
        component={AdminDashboard}
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
    </Switch>
  );
};

export default withContext(Routes);
