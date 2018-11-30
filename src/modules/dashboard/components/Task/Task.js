/* @flow */

import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Task from './Task.jsx';

import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';
import { mockTask, mockTaskReward } from './__datamocks__/mockTask';

const enhance = compose(
  withDialog(),
  withProps(() => {
    const task = mockTask;
    const user = userMock;
    const isTaskCreator =
      task.creator.toLowerCase() === user.walletAddress.toLowerCase() || false;
    return {
      task,
      taskReward: mockTaskReward,
      user,
      isTaskCreator,
      preventEdit:
        !!task && !task.currentState === 'finalized' && isTaskCreator,
      userClaimedProfile: !!(user && user.username),
    };
  }),
);

export default enhance(Task);
