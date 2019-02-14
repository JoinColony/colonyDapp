/* @flow */

import { compose, branch, withProps } from 'recompose';

import { TaskRecord } from '~immutable';

const withTask = compose(
  branch(
    props => props.taskId && props.ensName,
    withProps({
      task: TaskRecord({
        draftId: '1',
        title: 'Test from withTask',
        colonyENSName: 'cool-colony',
      }),
    }),
  ),
);

export default withTask;
