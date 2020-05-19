import React, { ComponentType, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useDispatch } from 'redux-react-hook';

import { CONNECT_ROUTE } from './routeConstants';
import { RouteComponentProps } from '~pages/RouteLayouts';
import { ActionTypes } from '~redux/index';

type routePropsFn = (params: any) => RouteComponentProps;

interface Props extends RouteProps {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  isConnected?: boolean;
  routeProps?: RouteComponentProps | routePropsFn;
}

const ConnectedOnlyRoute = ({
  component: Component,
  layout: Layout,
  path,
  isConnected,
  routeProps = {},
}: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: ActionTypes.WALLET_CREATE,
      payload: { method: 'software' },
    });
  }, [dispatch]);

  return (
    <Route
      path={path}
      /*
       * Render props that are passed directly to the route Component
       */
      render={(props) => {
        const {
          location,
          match: { params },
        } = props;
        const passedDownRouteProps =
          typeof routeProps !== 'function' ? routeProps : routeProps(params);
        if (isConnected) {
          return (
            <Layout routeProps={passedDownRouteProps} {...props}>
              <Component routeProps={passedDownRouteProps} {...props} />
            </Layout>
          );
        }
        return (
          <Redirect
            to={{
              pathname: CONNECT_ROUTE,
              state: { redirectTo: location },
            }}
          />
        );
      }}
    />
  );
};

export default ConnectedOnlyRoute;
