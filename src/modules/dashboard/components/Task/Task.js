/* @flow */

import { compose, withProps } from 'recompose';
import { withCurrentUser } from '../../../users/hocs';

import withDialog from '~core/Dialog/withDialog';

import Task from './Task.jsx';

import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';
import { mockTask } from './__datamocks__/mockTask';

const enhance = compose(
  withCurrentUser,
  withDialog(),
  withProps(() => {
    const task = mockTask;
    const user = userMock;
    const isTaskCreator =
      task.creator.toLowerCase() === user.profile.walletAddress.toLowerCase() ||
      false;
    return {
      task,
      user,
      isTaskCreator,
      preventEdit:
        !!task && !task.currentState === 'finalized' && isTaskCreator,
    };
  }),
);

export default enhance(Task);
