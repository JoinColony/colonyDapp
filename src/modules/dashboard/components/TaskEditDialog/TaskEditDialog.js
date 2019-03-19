/* @flow */
import { compose, withHandlers } from 'recompose';
import nanoid from 'nanoid';

import TaskEditDialog from './TaskEditDialog.jsx';

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const enhance = compose(
  withHandlers({
    addTokenFunding: ({ maxTokens }) => (
      values: { payouts?: Array<any> },
      helpers: () => void,
    ) => {
      if (canAddTokens(values, maxTokens))
        helpers.push({
          id: nanoid(),
        });
    },
    transform: ({ availableTokens }) => (action: Object) => ({
      ...action,
      payload: {
        assignee: action.payload.assignee,
        payouts: action.payload.payouts.map(({ token, amount }) => ({
          amount,
          token: availableTokens.get(token - 1),
        })),
      },
    }),
  }),
);

export default enhance(TaskEditDialog);
