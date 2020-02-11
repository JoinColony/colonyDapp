import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
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
import { NavBar, Plain, SimpleNav } from '~pages/RouteLayouts/index';

import { useLoggedInUser } from '~data/index';

import {
  CONNECT_ROUTE,
  COLONY_HOME_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
  NOT_FOUND_ROUTE,
  PROGRAM_ROUTE,
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
  back: {
    id: 'routes.Routes.back',
    defaultMessage: 'Go to {colonyName}',
  },
  userProfileEditBack: {
    id: 'routes.Routes.userProfileEditBack',
    defaultMessage: 'Go to profile',
  },
});

const Routes = () => {
  const { walletAddress, username } = useLoggedInUser();
  const isConnected = !!walletAddress;
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
        layout={Plain}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
        path={CREATE_WALLET_ROUTE}
        component={CreateWalletWizard}
        layout={Plain}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        path={[COLONY_HOME_ROUTE, PROGRAM_ROUTE]}
        component={ColonyHome}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={INBOX_ROUTE}
        component={Inbox}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={WALLET_ROUTE}
        component={Wallet}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={DASHBOARD_ROUTE}
        component={Dashboard}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        path={ADMIN_DASHBOARD_ROUTE}
        component={AdminDashboard}
        layout={NavBar}
        // @TODO find a good solution for dynamic backTexts
        /* backText={MSG.back} */
        /* backTextValues={({ */
        /*   computedMatch: { */
        /*     params: { colonyName }, */
        /*   }, */
        /* }) => ({ colonyName })} */
        /* backRoute={({ */
        /*   computedMatch: { */
        /*     params: { colonyName }, */
        /*   }, */
        /* }) => `/colony/${colonyName}`} */
      />
      <ConnectedOnlyRoute
        exact
        isConnected={isConnected}
        path={TASK_ROUTE}
        component={Task}
        layout={NavBar}
        /* backText={MSG.back} */
        /* backTextValues={({ */
        /*   computedMatch: { */
        /*     params: { colonyName }, */
        /*   }, */
        /* }) => ({ colonyName })} */
        /* backRoute={({ */
        /*   computedMatch: { */
        /*     params: { colonyName }, */
        /*   }, */
        /* }) => `/colony/${colonyName}`} */
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={CREATE_COLONY_ROUTE}
        component={CreateColonyWizard}
        layout={Plain}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={CREATE_USER_ROUTE}
        component={CreateUserWizard}
        layout={Plain}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_ROUTE}
        component={UserProfile}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
      />
      <ConnectedOnlyRoute
        isConnected={isConnected}
        path={USER_EDIT_ROUTE}
        component={UserProfileEdit}
        layout={NavBar}
        routeProps={{
          backText: MSG.userProfileEditBack,
          backRoute: `/user/${username}`,
        }}
      />
    </Switch>
  );
};

export default Routes;
