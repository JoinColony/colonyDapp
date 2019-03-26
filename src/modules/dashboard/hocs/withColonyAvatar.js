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
  ensName: string,
  avatarData?: string,
};

const withColonyAvatar = compose(
  connect(
    (state: RootStateRecord, { ensName }: Props) => ({
      avatarData: colonyAvatarDataSelector(state, ensName),
      avatarHash: colonyAvatarHashSelector(state, ensName),
    }),
    {
      fetchColonyAvatar,
    },
  ),
  fetchMissingColonyAvatar,
);

export default withColonyAvatar;
