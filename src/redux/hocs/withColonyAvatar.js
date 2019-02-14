/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { fetchColonyAvatar } from '../actionCreators';
import {
  colonyAvatarDataSelector,
  colonyAvatarHashSelector,
} from '../selectors';
import fetchMissingColonyAvatar from './fetchMissingColonyAvatar';

import type { RootStateRecord } from '~immutable';

type Props = {
  ensName?: string,
  avatarData?: string,
};

const withColonyAvatar = compose(
  connect(
    (state: RootStateRecord, props: Props) => ({
      avatarData: colonyAvatarDataSelector(state, props),
      // TODO what's the deal with this?
      avatarHash: colonyAvatarHashSelector.resultFunc(state, props),
    }),
    {
      fetchColonyAvatar,
    },
  ),
  fetchMissingColonyAvatar,
);

export default withColonyAvatar;
