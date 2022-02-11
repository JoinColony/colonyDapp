import React, { useEffect, useMemo } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { WalletMethod } from '~immutable/index';
import CreateUserWizard from '~dashboard/CreateUserWizard';
import FourOFour from '~dashboard/FourOFour';
import ConnectWalletWizard from '~users/ConnectWalletWizard';
import UserProfile from '~users/UserProfile';
import UserProfileEdit from '~users/UserProfileEdit';
import { NavBar, Plain, SimpleNav, Default } from '~pages/RouteLayouts/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import LadingPage from '~pages/LandingPage';

import appLoadingContext from '~context/appLoadingState';
import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';

import {
  CONNECT_ROUTE,
  CREATE_USER_ROUTE,
  NOT_FOUND_ROUTE,
  USER_EDIT_ROUTE,
  USER_ROUTE,
  LANDING_PAGE_ROUTE,
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
          render={() => <Redirect to={LANDING_PAGE_ROUTE} />}
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

        <AlwaysAccesibleRoute
          path={LANDING_PAGE_ROUTE}
          component={LadingPage}
          layout={Default}
          routeProps={{
            hasBackLink: false,
          }}
        />
        <AlwaysAccesibleRoute
          path={USER_ROUTE}
          component={UserProfile}
          layout={SimpleNav}
          routeProps={{
            hasBackLink: false,
          }}
        />
        <AlwaysAccesibleRoute
          path={USER_EDIT_ROUTE}
          component={UserProfileEdit}
          layout={NavBar}
          routeProps={{
            backText: MSG.userProfileEditBack,
            backRoute: `/user/${username}`,
          }}
        />
        {/*
         * Redirect anything else that's not found to the 404 route
         */}
        <Redirect to={NOT_FOUND_ROUTE} />
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
