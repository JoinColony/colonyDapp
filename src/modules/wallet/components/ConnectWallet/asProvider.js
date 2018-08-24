/* @flow */
import type { ContextRouter } from 'react-router-dom';

import { compose, withHandlers, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

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
        history.push('/');
      },
      handleExit: (props: Props) => () => {
        const { history } = props;
        history.push('/start');
      },
    }),
  );

export default asProvider;
