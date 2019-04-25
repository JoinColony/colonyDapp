/* @flow */

import { compose, withProps } from 'recompose';

import { withImmutablePropsToJS } from '~utils/hoc';

import { withColony, withTask, withToken } from '../../../dashboard/hocs';

import TransactionListItem from './TransactionListItem.jsx';

/*
 * @todo TransactionListItem: use react hooks
 * @body In the future, come up with a better way of providing this data to the
 * component. Many recompose wrappers is potentially bad for performance.
 * Soon-to-be-arriving React Hooks could offer a nicer solution here.
 */
export default compose(
  withProps(({ transaction: { taskId, token, from, to, incoming } }) => ({
    colonyAddress: incoming ? from : to,
    taskId,
    tokenAddress: token,
    userAddress: incoming ? from : to,
  })),
  withColony,
  withTask,
  withToken,
  withImmutablePropsToJS,
)(TransactionListItem);
