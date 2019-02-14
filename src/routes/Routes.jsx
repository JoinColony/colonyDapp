/* @flow */

import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import CreateColonyWizard from '~components/CreateColonyWizard';
import ColonyHome from '~components/ColonyHome';
import Task from '~components/Task';
import Dashboard from '~components/Dashboard';
import Inbox from '~components/Inbox';
import Wallet from '~components/Wallet';

import ConnectWalletWizard from '~components/ConnectWalletWizard';
import CreateWalletWizard from '~components/CreateWalletWizard';
import UserProfile from '~components/UserProfile';
import UserProfileEdit from '~components/UserProfileEdit';

import AdminDashboard from '~components/AdminDashboard';

import { currentUser as currentUserSelector } from '~redux/selectors';

import {
  CONNECT_ROUTE,
  COLONY_HOME_ROUTE,
  CREATE_COLONY_ROUTE,
  TASK_ROUTE,
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

// We cannot add types to this component's props because of how we're using
// `connect` and importing it elsewhere: https://github.com/flow-typed/flow-typed/issues/1946
// eslint-disable-next-line react/prop-types
const Routes = ({ currentUser }) => {
  const isConnected = !!(currentUser && currentUser.profile.walletAddress);
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
        exact
        isConnected={isConnected}
        path={COLONY_HOME_ROUTE}
        component={ColonyHome}
        backRoute={DASHBOARD_ROUTE}
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
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={DASHBOARD_ROUTE}
        component={Dashboard}
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        path={ADMIN_DASHBOARD_ROUTE}
        component={AdminDashboard}
        appearance={{ theme: 'transparent' }}
        hasBackLink={false}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        path={TASK_ROUTE}
        component={Task}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={CREATE_COLONY_ROUTE}
        component={CreateColonyWizard}
        hasNavigation={false}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_ROUTE}
        component={UserProfile}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_EDIT_ROUTE}
        component={UserProfileEdit}
        appearance={{ theme: 'transparent' }}
      />
    </Switch>
  );
};

const RoutesContainer = connect(
  state => ({
    currentUser: currentUserSelector(state),
  }),
  null,
)(Routes);

// XXX we need `withRouter` here because (surprisingly) react-router-dom is not
// using the router context property (available to e.g. each `Switch`):
// https://github.com/ReactTraining/react-router/issues/4671
// We are using `withRouter` to get around `connect()`'s `shouldComponentUpdate`
// function blocking updates when the route location changes.
export default withRouter(RoutesContainer);
