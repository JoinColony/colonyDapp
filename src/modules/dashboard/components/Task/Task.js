/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import { withImmutablePropsToJS } from '~utils/hoc';
import withDialog from '~core/Dialog/withDialog';

import { withCurrentUser } from '../../../users/hocs';
import {
  canTaskBeFinalized,
  canTaskPayoutBeClaimed,
  didTaskDueDateElapse,
  taskFeedItemsSelector,
  isTaskManager,
  isTaskWorker,
} from '~redux/selectors';

import Task from './Task.jsx';

import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';
import { mockTask } from './__datamocks__/mockTask';

// TODO remove in #939
const dummyProps = { draftId: '1', colonyENSName: 'cool-colony' };

const enhance = compose(
  withCurrentUser,
  // TODO in #939 wire this up with hooks instead; this is just indicative
  // of the state that will be needed.
  // Suggestion: use `useFeatureFlags` 🚀
  connect(state => ({
    canTaskBeFinalized: canTaskBeFinalized(state, dummyProps),
    canTaskPayoutBeClaimed: canTaskPayoutBeClaimed(state, dummyProps),
    didTaskDueDateElapse: didTaskDueDateElapse(state, dummyProps),
    feedItems: taskFeedItemsSelector(state, dummyProps),
    isTaskManager: isTaskManager(state, dummyProps),
    isTaskWorker: isTaskWorker(state, dummyProps),
  })),
  withDialog(),
  // TODO in #939 replace these mocks with hooks
  withProps(() => {
    const task = mockTask;
    const user = userMock;
    const isTaskCreator = task.manager.address === user.profile.walletAddress;
    return {
      task,
      user,
      isTaskCreator,
      preventEdit:
        !!task && !task.currentState === 'finalized' && isTaskCreator,
    };
  }),
  withImmutablePropsToJS,
);
export default enhance(Task);
