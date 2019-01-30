/* @flow */

import { connect } from 'react-redux';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import { getColonyAdmins } from '../../dashboard/selectors';

const withDomains = connect(
  (state: RootStateRecord, { ensName }: { ensName: ENSName }) => ({
    colonyAdmins: getColonyAdmins(state, ensName),
  }),
);

export default withDomains;
