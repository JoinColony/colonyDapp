import React, { useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

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
import LevelEdit from '~dashboard/LevelEdit';
import { NavBar, Plain, SimpleNav } from '~pages/RouteLayouts/index';
import { ColonyBackText, ProgramBackText } from '~pages/BackTexts';
import LoadingTemplate from '~pages/LoadingTemplate';

import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { useSelector } from '~utils/hooks';
import { setupSagasLoadedSelector } from '../modules/core/selectors';

import {
  CONNECT_ROUTE,
  COLONY_HOME_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
  LEVEL_EDIT_ROUTE,
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
  LEVEL_ROUTE,
} from './routeConstants';

import DisconnectedOnlyRoute from './DisconnectedOnlyRoute';
import AlwaysAccesibleRoute from './AlwaysAccesibleRoute';

const MSG = defineMessages({
  userProfileEditBack: {
    id: 'routes.Routes.userProfileEditBack',
    defaultMessage: 'Go to profile',
  },
  loadingAppMessage: {
    id: 'routes.Routes.loadingAppMessage',
    defaultMessage: 'Loading App',
  },
});

const Routes = () => {
  const contextSagasLoaded = useSelector(setupSagasLoadedSelector);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const dispatch = useDispatch();
  useEffect(() => {
    if (ethereal) {
      dispatch({
        type: ActionTypes.WALLET_CREATE,
        payload: { method: 'ethereal' },
      });
    }
  }, [dispatch, ethereal]);
  const isConnected = !!walletAddress && !ethereal;
  const didClaimProfile = !!username;
  // const isConnected = true;

  if (!contextSagasLoaded) {
    return <LoadingTemplate loadingText={MSG.loadingAppMessage} />;
  }

  return (
    <Switch>
      <Route
        exact
        path="/"
        // render={() => {
        //   const connectedRoute = didClaimProfile
        //     ? DASHBOARD_ROUTE
        //     : CREATE_USER_ROUTE;
        //   return <Redirect to={isConnected ? connectedRoute : CONNECT_ROUTE} />;
        // }}
        render={() => <Redirect to={DASHBOARD_ROUTE} />}
      />
      <Route exact path={NOT_FOUND_ROUTE} component={FourOFour} />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        // didClaimProfile={didClaimProfile}
        // didClaimProfile
        path={CONNECT_ROUTE}
        component={ConnectWalletWizard}
        layout={Plain}
      />
      <DisconnectedOnlyRoute
        isConnected={isConnected}
        // didClaimProfile={didClaimProfile}
        path={CREATE_WALLET_ROUTE}
        component={CreateWalletWizard}
        layout={Plain}
      />

      <AlwaysAccesibleRoute
        path={DASHBOARD_ROUTE}
        component={Dashboard}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      <AlwaysAccesibleRoute
        exact
        path={[COLONY_HOME_ROUTE, LEVEL_ROUTE, PROGRAM_ROUTE]}
        component={ColonyHome}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      <AlwaysAccesibleRoute
        exact
        path={ADMIN_DASHBOARD_ROUTE}
        component={AdminDashboard}
        layout={NavBar}
        routeProps={({ colonyName }) => ({
          backText: ColonyBackText,
          backRoute: `/colony/${colonyName}`,
        })}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      <AlwaysAccesibleRoute
        exact
        path={LEVEL_EDIT_ROUTE}
        component={LevelEdit}
        layout={NavBar}
        routeProps={({ colonyName, programId }) => ({
          backText: ProgramBackText,
          backRoute: `/colony/${colonyName}/program/${programId}`,
        })}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      <AlwaysAccesibleRoute
        path={USER_ROUTE}
        component={UserProfile}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      <AlwaysAccesibleRoute
        path={USER_EDIT_ROUTE}
        component={UserProfileEdit}
        layout={NavBar}
        routeProps={{
          backText: MSG.userProfileEditBack,
          backRoute: `/user/${username}`,
        }}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      <AlwaysAccesibleRoute
        exact
        path={TASK_ROUTE}
        component={Task}
        layout={NavBar}
        routeProps={({ colonyName }) => ({
          backText: ColonyBackText,
          backRoute: `/colony/${colonyName}`,
        })}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      {/*
       * @TODO Redirect to connect wallet
       */}
      <AlwaysAccesibleRoute
        path={WALLET_ROUTE}
        component={Wallet}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      {/*
       * @TODO Redirect to connect wallet
       */}
      <AlwaysAccesibleRoute
        path={INBOX_ROUTE}
        component={Inbox}
        layout={SimpleNav}
        routeProps={{
          hasBackLink: false,
        }}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      {/*
       * @TODO Redirect to connect wallet
       */}
      <AlwaysAccesibleRoute
        path={CREATE_COLONY_ROUTE}
        component={CreateColonyWizard}
        layout={Plain}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
      {/*
       * @TODO Redirect to connect wallet
       */}
      <AlwaysAccesibleRoute
        path={CREATE_USER_ROUTE}
        component={CreateUserWizard}
        layout={Plain}
        isConnected={isConnected}
        didClaimProfile={didClaimProfile}
      />
    </Switch>
  );
};

export default Routes;
