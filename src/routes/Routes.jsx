/* @flow */

import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import CreateColonyWizard from '~dashboard/CreateColonyWizard';
import CreateUserWizard from '~dashboard/CreateUserWizard';
import ColonyHome from '~dashboard/ColonyHome';
import Task from '~dashboard/Task';
import FourOFour from '~dashboard/FourOFour';
import Dashboard from '~dashboard/Dashboard';
import Inbox from '~users/Inbox';
import Wallet from '~dashboard/Wallet';

import ConnectWalletWizard from '~users/ConnectWalletWizard';
import CreateWalletWizard from '~users/CreateWalletWizard';
import UserProfile from '~users/UserProfile';
import UserProfileEdit from '~users/UserProfileEdit';

import AdminDashboard from '~admin/AdminDashboard';

import { walletAddressSelector } from '../modules/users/selectors';

import {
  CONNECT_ROUTE,
  COLONY_HOME_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
  NOT_FOUND_ROUTE,
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
const Routes = ({ walletAddress }) => {
  const isConnected = !!walletAddress;
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <Redirect to={isConnected ? DASHBOARD_ROUTE : CONNECT_ROUTE} />
        )}
      />
      <Route exact path={NOT_FOUND_ROUTE} component={FourOFour} />
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
        path={CREATE_USER_ROUTE}
        component={CreateUserWizard}
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
    walletAddress: walletAddressSelector(state),
  }),
  null,
)(Routes);

// We need `withRouter` here because (surprisingly) react-router-dom is not
// using the router context property (available to e.g. each `Switch`):
// https://github.com/ReactTraining/react-router/issues/4671
// We are using `withRouter` to get around `connect()`'s `shouldComponentUpdate`
// function blocking updates when the route location changes.
export default withRouter(RoutesContainer);
