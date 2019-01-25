/* @flow */

import { compose, branch, withProps } from 'recompose';

import { TaskRecord } from '~immutable';

// eslint-disable-next-line import/no-named-as-default
import mockTask from '../../dashboard/components/Task/__datamocks__/mockTask';

const withTask = compose(
  // $FlowFixMe Let's fix this when we wire it properly
  branch(
    props => props.taskId && props.ensName,
    withProps({
      task: mockTask,
    }),
  ),
);

export default withTask;
