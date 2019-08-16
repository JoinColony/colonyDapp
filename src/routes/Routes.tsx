import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';

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

import {
  currentUsernameSelector,
  walletAddressSelector,
} from '../modules/users/selectors';

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

import ConnectedOnlyRoute from './ConnectedOnlyRoute';
import DisconnectedOnlyRoute from './DisconnectedOnlyRoute';

const MSG = defineMessages({
  taskBack: {
    id: 'routes.Routes.taskBack',
    defaultMessage: 'Go to {colonyName}',
  },
  userProfileEditBack: {
    id: 'routes.Routes.userProfileEditBack',
    defaultMessage: 'Go to profile',
  },
});

// We cannot add types to this component's props because of how we're using
// `connect` and importing it elsewhere: https://github.com/flow-typed/flow-typed/issues/1946
// eslint-disable-next-line react/prop-types
const Routes = ({ isConnected, username }) => {
  const didClaimProfile = !!username;
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          const connectedRoute = didClaimProfile
            ? DASHBOARD_ROUTE
            : CREATE_USER_ROUTE;
          return <Redirect to={isConnected ? connectedRoute : CONNECT_ROUTE} />;
        }}
      />
      <Route exact path={NOT_FOUND_ROUTE} component={FourOFour} />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={CONNECT_ROUTE}
        component={ConnectWalletWizard}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={CREATE_WALLET_ROUTE}
        component={CreateWalletWizard}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={COLONY_HOME_ROUTE}
        component={ColonyHome}
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={INBOX_ROUTE}
        component={Inbox}
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={WALLET_ROUTE}
        component={Wallet}
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={DASHBOARD_ROUTE}
        component={Dashboard}
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={ADMIN_DASHBOARD_ROUTE}
        component={AdminDashboard}
        appearance={{ theme: 'transparent' }}
        hasBackLink={false}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={TASK_ROUTE}
        component={Task}
        backText={MSG.taskBack}
        backTextValues={({
          computedMatch: {
            params: { colonyName },
          },
        }) => ({ colonyName })}
        backRoute={({
          computedMatch: {
            params: { colonyName },
          },
        }) => `/colony/${colonyName}`}
        hasBackLink
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={CREATE_COLONY_ROUTE}
        component={CreateColonyWizard}
        hasNavigation={false}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={CREATE_USER_ROUTE}
        component={CreateUserWizard}
        hasNavigation={false}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={USER_ROUTE}
        component={UserProfile}
        hasBackLink={false}
        appearance={{ theme: 'transparent' }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={USER_EDIT_ROUTE}
        component={UserProfileEdit}
        appearance={{ theme: 'transparent' }}
        backText={MSG.userProfileEditBack}
        backRoute={`/user/${username}`}
        hasBackLink
      />
    </Switch>
  );
};

const RoutesContainer: any = connect(
  (state: any) => ({
    username: currentUsernameSelector(state),
    isConnected: !!walletAddressSelector(state),
  }),
  null,
)(Routes);

// We need `withRouter` here because (surprisingly) react-router-dom is not
// using the router context property (available to e.g. each `Switch`):
// https://github.com/ReactTraining/react-router/issues/4671
// We are using `withRouter` to get around `connect()`'s `shouldComponentUpdate`
// function blocking updates when the route location changes.
export default withRouter(RoutesContainer);
