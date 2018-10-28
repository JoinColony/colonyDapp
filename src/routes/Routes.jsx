/* @flow */

import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import CreateColonyWizard from '~dashboard/CreateColonyWizard';
import ColonyHome from '~dashboard/ColonyHome';
import Task from '~dashboard/Task';
import Dashboard from '~dashboard/Dashboard';

import Inbox from '~dashboard/Inbox';

import ConnectWalletWizard from '~users/ConnectWalletWizard';
import CreateWalletWizard from '~users/CreateWalletWizard';
import UserProfile from '~users/UserProfile';
import UserProfileEdit from '~users/UserProfileEdit';

import AdminDashboard from '~admin/AdminDashboard';

import { currentUserState } from '../modules/users/selectors';

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

const Wallet = () => <h1 style={{ fontSize: '32px' }}>Wallet</h1>;

// We cannot add types to this component's props because of how we're using
// `connect` and importing it elsewhere: https://github.com/flow-typed/flow-typed/issues/1946
// eslint-disable-next-line react/prop-types
const Routes = ({ currentUser }) => {
  const isConnected = !!(currentUser && currentUser.walletAddress);
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
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={ADMIN_DASHBOARD_ROUTE}
        component={AdminDashboard}
        hasNavigation={false}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={COLONY_HOME_ROUTE}
        component={ColonyHome}
        backRoute={DASHBOARD_ROUTE}
      />
<<<<<<< HEAD
      <Route
=======
      <ConnectedOnlyRoute
>>>>>>> 0534d589... Take out eth conversion into util
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
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_EDIT_ROUTE}
        component={UserProfileEdit}
      />
    </Switch>
  );
};

const RoutesContainer = connect(
  state => ({
    currentUser: currentUserState(state),
  }),
  null,
)(Routes);

// XXX we need `withRouter` here because (surprisingly) react-router-dom is not
// using the router context property (available to e.g. each `Switch`):
// https://github.com/ReactTraining/react-router/issues/4671
// We are using `withRouter` to get around `connect()`'s `shouldComponentUpdate`
// function blocking updates when the route location changes.
export default withRouter(RoutesContainer);
