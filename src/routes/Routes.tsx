import React, { useEffect, useMemo } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { WalletMethod } from '~immutable/index';
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
import appLoadingContext from '~context/appLoadingState';

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

import AlwaysAccesibleRoute from './AlwaysAccesibleRoute';
import WalletRequiredRoute from './WalletRequiredRoute';

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
  const isAppLoading = appLoadingContext.getIsLoading();
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const dispatch = useDispatch();
  useEffect(() => {
    if (ethereal) {
      dispatch({
        type: ActionTypes.WALLET_CREATE,
        payload: { method: WalletMethod.Ethereal },
      });
    }
  }, [dispatch, ethereal]);

  const isConnected = !!walletAddress && !ethereal;
  const didClaimProfile = !!username;

  /**
   * @NOTE Memoized Switch
   *
   * We need to memoize the entire route switch to prevent re-renders at not
   * so oportune times.
   *
   * The `balance` value, accessible through `useLoggedInUser`, even if we don't
   * use it here directly, will cause a re-render of the `<Routes />` component
   * every time it changes (using the subscription).
   *
   * To prevent this, we memoize the whole routes logic, to only render it again
   * when the user connects a new wallet.
   *
   * This was particularly problematic when creating a new colony, and after
   * the first TX, the balance would change and as a result everything would
   * re-render, reseting the wizard.
   */
  const MemoizedSwitch = useMemo(
    () => (
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Redirect to={DASHBOARD_ROUTE} />}
        />
        <Route exact path={NOT_FOUND_ROUTE} component={FourOFour} />

        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={CONNECT_ROUTE}
          component={ConnectWalletWizard}
          layout={Plain}
        />
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={CREATE_USER_ROUTE}
          component={CreateUserWizard}
          layout={Plain}
        />
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={CREATE_COLONY_ROUTE}
          component={CreateColonyWizard}
          layout={Plain}
        />
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={WALLET_ROUTE}
          component={Wallet}
          layout={SimpleNav}
          routeProps={{
            hasBackLink: false,
          }}
        />
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={INBOX_ROUTE}
          component={Inbox}
          layout={SimpleNav}
          routeProps={{
            hasBackLink: false,
          }}
        />

        <AlwaysAccesibleRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
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
      </Switch>
    ),
    [didClaimProfile, isConnected, username],
  );

  if (isAppLoading) {
    return <LoadingTemplate loadingText={MSG.loadingAppMessage} />;
  }
  return MemoizedSwitch;
};

export default Routes;
