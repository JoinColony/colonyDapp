/* @flow */
import { compose, withHandlers } from 'recompose';
import nanoid from 'nanoid';

import type { Action } from '~types';
import type { FormValues, InProps } from './types';

import TaskEditDialog from './TaskEditDialog.jsx';

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const enhance = compose(
  withHandlers({
    addTokenFunding: ({ maxTokens }: InProps) => (
      values: { payouts?: Array<any> },
      helpers: () => void,
    ) => {
      if (canAddTokens(values, maxTokens))
        helpers.push({
          id: nanoid(),
        });
    },
    setPayload: ({
      availableTokens,
      task: { colonyENSName, id: taskId },
    }: InProps) => (action: Action, { assignee, payouts }: FormValues) => ({
      ...action,
      payload: {
        assignee,
        colonyENSName,
        payouts: payouts.map(({ token, amount }) => ({
          amount,
          token: availableTokens.get(token - 1),
        })),
        taskId,
      },
    }),
  }),
);

export default enhance(TaskEditDialog);
