/* @flow */

import { connect } from 'react-redux';
import { compose, branch, withProps } from 'recompose';

import { TaskRecord } from '~immutable';
import type { RootStateRecord } from '~immutable';

import { fetchTaskComments } from '../actionCreators';

const withTask = compose(
  connect(
    (
      state: RootStateRecord,
      {
        commentStoreAddress,
        colonyENSName,
      }: { commentStoreAddress: string, colonyENSName: string },
    ) => ({
      comments: fetchTaskComments(colonyENSName, commentStoreAddress),
    }),
  ),
  branch(
    props => props.taskId && props.ensName,
    withProps({
      task: TaskRecord({
        draftId: '1',
        title: 'Test from withTask',
        colonyENSName: 'cool-colony',
        commentStoreAddress: '',
      }),
    }),
  ),
);

export default withTask;
