/* @flow */

import { compose, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import withDialog from '~core/Dialog/withDialog';

import Task from './Task.jsx';

import promiseListener from '../../../../createPromiseListener';

import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';
import { mockTask } from './__datamocks__/mockTask';

const enhance = compose(
  withDialog(),
  lifecycle({
    componentDidMount() {
      this.asyncFunc = promiseListener.createAsyncFunction({
        start: 'TASK_FETCH_DETAILS',
        resolve: 'TASK_FETCH_DETAILS_SUCCESS',
        reject: 'TASK_FETCH_DETAILS_ERROR',
      });
    },
  }),
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
        !!task &&
        !task.currentState === 'TASK_STATE.FINALIZED' &&
        isTaskCreator,
    };
  }),
  connect(
    state => ({
      task: state.task,
    }),
    {},
  ),
);

export default enhance(Task);
