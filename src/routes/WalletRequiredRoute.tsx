import React, { ComponentType } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps as ReactRouterComponentProps,
} from 'react-router-dom';
import { StaticContext } from 'react-router';

import FeedbackWidget from '~core/FeedbackWidget';
import { RouteComponentProps } from '~pages/RouteLayouts';

import {
  CREATE_USER_ROUTE,
  LANDING_PAGE_ROUTE,
  CONNECT_ROUTE,
  CREATE_COLONY_ROUTE,
} from './routeConstants';

interface ComponentProps extends RouteProps {
  routeProps?: RouteComponentProps;
}

interface Props extends RouteProps {
  component: ComponentType<ComponentProps>;
  layout: ComponentType<ComponentProps>;
  didClaimProfile?: boolean;
  isConnected?: boolean;
  routeProps?: RouteComponentProps;
  path?: string;
}

const WalletRequiredRoute = ({
  component: Component,
  didClaimProfile,
  isConnected,
  layout: Layout,
  location,
  routeProps,
  path,
}: Props) => {
  const RouteComponent = ({ ...props }) => (
    <Layout routeProps={routeProps} {...props}>
      <Component routeProps={routeProps} {...props} />
      <FeedbackWidget />
    </Layout>
  );
  const locationPath = location && `${location.pathname}${location.search}`;
  return (
    <Route
      path={path}
      render={(
        props: ReactRouterComponentProps<
          {},
          StaticContext,
          {
            redirectTo?: string;
            colonyURL?: string;
          }
        >,
      ) => {
        /**
         * Connected
         */
        if (isConnected) {
          const redirectTo =
            props.location.state && props.location.state.redirectTo;
          const colonyURL =
            props.location.state && props.location.state.colonyURL;
          /**
           * Has username
           */
          if (didClaimProfile) {
            /**
             * If we're entered the app through a different route before
             * connecting the wallet, then redirect back to it
             */
            if (redirectTo) {
              return (
                <Redirect
                  to={{
                    pathname: redirectTo,
                    state: {
                      colonyURL,
                    },
                  }}
                />
              );
            }
            /**
             * We've connected, but already have a profile, just redirect to
             * the dashboard.
             *
             * This is the case when you enter the app using the /connect route
             */
            if (path === CONNECT_ROUTE) {
              return <Redirect to={LANDING_PAGE_ROUTE} />;
            }
            /**
             * We've connected, have a profile, and no redirect available.
             * In this case just render the underlying component.
             *
             * This is the case when accessing the /wallet or /inbox route,
             * then connecting your wallet
             *
             * But we have to prevent it for the /create-colony route, otherwise,
             * in cases were we also create a username alongside the new colony,
             * after the user tx is mined, the page will try to re-render as
             * the logged in user state changes.
             * The below check will prevent that from happening as it will not
             * allow the route component to render again, keeping the wizard
             * flow intact.
             */
            if (path !== CREATE_COLONY_ROUTE) {
              return <RouteComponent {...props} />;
            }
          }
          /**
           * Doesn't have a username
           */
          /**
           * If we don't have a username, and entered the app through the
           * create a colony route, just redirect back to it, since the
           * Wizard can handle creating a username alongside a colony.
           */
          if (
            typeof redirectTo == 'string' &&
            redirectTo.startsWith(CREATE_COLONY_ROUTE)
          ) {
            return <Redirect to={redirectTo} />;
          }
          /**
           * This is the next step from the above redirect. If we've just
           * redirected, just render the create colony Wizard.
           *
           * If we don't have this check, we'll end up redirecting ad infinitum.
           */
          if (path === CREATE_COLONY_ROUTE) {
            return (
              <Layout routeProps={routeProps} {...props}>
                <Component routeProps={routeProps} {...props} />
                <FeedbackWidget />
              </Layout>
            );
          }
          /**
           * If we don't have a username, redirect to the create user route,
           * but be mindfull of the redirect path, and after creating the
           * username, redirect back to your original entry point
           */
          if (path !== CREATE_USER_ROUTE) {
            return (
              <Redirect
                to={{
                  pathname: CREATE_USER_ROUTE,
                  state: {
                    ...props.location.state,
                    redirectTo: colonyURL || redirectTo || locationPath,
                  },
                }}
              />
            );
          }
        }
        /**
         * Not connected
         */
        /**
         * We don't have a wallet connected, but did not enter the app through
         * the /connect route. Just redirect to the connect page, but be mindfull
         * of the initial entry point, and redirect back to it, once the wallet
         * has been connected.
         */
        if (!isConnected && path !== CONNECT_ROUTE) {
          return (
            <Redirect
              to={{
                pathname: CONNECT_ROUTE,
                state: {
                  ...location?.state,
                  redirectTo: locationPath,
                },
              }}
            />
          );
        }

        /**
         * Catch all component render
         *
         * This is the case when you enter the app directly using the /connect
         * route, but before you connect the wallet.
         */
        return <RouteComponent {...props} />;
      }}
    />
  );
};

export default WalletRequiredRoute;
