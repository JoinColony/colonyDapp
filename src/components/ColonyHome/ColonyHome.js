/* @flow */

import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import { withFeatureFlags } from '~utils/hoc';
import { withColonyFromRoute, withDomains } from '~redux/hocs';

import { getColonyAdmins, getColonyDomains } from '../../redux/selectors';
import { walletAddressSelector } from '../../redux/selectors/users';

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
