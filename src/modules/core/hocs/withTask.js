/* @flow */

import { compose, branch, withProps } from 'recompose';

import { Task } from '~immutable';

const withTask = compose(
  branch(
    props => props.taskId && props.ensName,
    withProps({
      task: Task({
        id: '1',
        title: 'Test from withTask',
        colonyENSName: 'cool-colony',
      }),
    }),
  ),
);

export default withTask;
