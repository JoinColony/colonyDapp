/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { fetchUserAvatar } from '../actionCreators';
import { avatarSelector } from '../selectors';
import fetchMissingUserAvatar from './fetchMissingUserAvatar';

import type {
  DataRecordType,
  RootStateRecord,
  UserRecordType,
} from '~immutable';

type Props = {
  user: DataRecordType<UserRecordType>,
  avatarData?: string,
};

const withUserAvatar = compose(
  connect(
    (state: RootStateRecord, props: Props) => ({
      avatarData: avatarSelector(state, props),
    }),
    {
      fetchUserAvatar,
    },
  ),
  fetchMissingUserAvatar,
);

export default withUserAvatar;
