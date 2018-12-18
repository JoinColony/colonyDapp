/* @flow */

import { compose, branch, withProps } from 'recompose';

import { Task } from '~immutable';

const withTask = compose(
  branch(
    props => props.taskId && props.colonyENSName,
    withProps({
      task: Task(),
    }),
  ),
);

export default withTask;
