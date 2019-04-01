/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { fetchColonyAvatar } from '../actionCreators';
import {
  colonyAvatarDataSelector,
  colonyAvatarHashSelector,
} from '../selectors';
import fetchMissingColonyAvatar from './fetchMissingColonyAvatar';

import type { ColonyType, RootStateRecord } from '~immutable';

type Props = {
  colony: ColonyType,
};

const withColonyAvatar = compose(
  connect(
    (state: RootStateRecord, { colony: { ensName } }: Props) => ({
      avatar: colonyAvatarDataSelector(state, ensName),
      avatarHash: colonyAvatarHashSelector(state, ensName),
    }),
    {
      fetchColonyAvatar,
    },
  ),
  fetchMissingColonyAvatar,
);

export default withColonyAvatar;
