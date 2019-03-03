/* @flow */

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import { withImmutablePropsToJS } from '~utils/hoc';
import { withDomains } from '../../../admin/hocs';

import { getColonyAdmins, getColonyDomains } from '../../selectors';
import { currentUserAddressSelector } from '../../../users/selectors/users';

import ColonyHome from './ColonyHome.jsx';

const enhance = compose(
  withDomains,
  connect((state: RootStateRecord, { ensName }: { ensName: ENSName }) => ({
    walletAddress: currentUserAddressSelector(state),
    colonyAdmins: getColonyAdmins(state, ensName),
    colonyDomains: getColonyDomains(state, ensName),
  })),
  withImmutablePropsToJS,
);

export default enhance(ColonyHome);
