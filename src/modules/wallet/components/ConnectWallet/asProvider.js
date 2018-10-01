/* @flow */
import type { ContextRouter } from 'react-router-dom';
import { compose, withHandlers, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import { CREATE_PROFILE_ROUTE, START_ROUTE } from '~routes';

type Props = ContextRouter & {
  isConnected: boolean,
  setIsConnected: (isConnected: boolean) => void,
};

const asProvider = (): Function =>
  compose(
    withRouter,
    withState('isConnected', 'setIsConnected', false),
    withHandlers({
      handleDidConnectWallet: (props: Props) => () => {
        const { history } = props;
        history.push(CREATE_PROFILE_ROUTE);
      },
      handleExit: (props: Props) => () => {
        const { history } = props;
        history.push(START_ROUTE);
      },
    }),
  );

export default asProvider;
