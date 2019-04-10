/* @flow */

import { compose, withProps } from 'recompose';

import { withImmutablePropsToJS } from '~utils/hoc';

import {
  withColony,
  withTask,
  withToken,
  withColonyENSName,
} from '../../../dashboard/hocs';

import TransactionListItem from './TransactionListItem.jsx';

/*
 * TODO: in the future, come up with a better way of providing this data to the
 * component. Many recompose wrappers is potentially bad for performance.
 * Soon-to-be-arriving React Hooks could offer a nicer solution here.
 */
export default compose(
  withProps(
    ({ transaction: { colonyName, taskId, token, from, to, incoming } }) => ({
      ensName: colonyName,
      taskId,
      tokenAddress: token,
      userAddress: incoming ? from : to,
      colonyAddress: incoming ? from : to,
    }),
  ),
  withColonyENSName,
  withColony,
  withTask,
  withToken,
  withImmutablePropsToJS,
)(TransactionListItem);
