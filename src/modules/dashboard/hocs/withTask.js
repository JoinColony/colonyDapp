/* @flow */

import { compose, branch, withProps } from 'recompose';

// eslint-disable-next-line import/no-named-as-default
import mockTask from '../components/Task/__datamocks__/mockTask';

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
