/* @flow */

import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import { withFeatureFlags } from '~utils/hoc';
import { withColonyFromRoute } from '../../hocs';
import { withDomains } from '../../../admin/hocs';

import { getColonyAdmins, getColonyDomains } from '../../selectors';
import { walletAddressSelector } from '../../../users/selectors/users';

import ColonyHome from './ColonyHome.jsx';

const enhance = compose(
  withColonyFromRoute,
  withFeatureFlags(),
  withDomains,
  connect((state: RootStateRecord, { ensName }: { ensName: ENSName }) => ({
    walletAddress: walletAddressSelector(state),
    colonyAdmins: getColonyAdmins(state, ensName),
    colonyDomains: getColonyDomains(state, ensName),
  })),
  withImmutablePropsToJS,
);

export default enhance(ColonyHome);
