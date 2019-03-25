/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName } from '~types';
import type {
  RootStateRecord,
  ColonyRecordType,
  ColonyType,
  NetworkProps,
} from '~immutable';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_AVATARS,
  DASHBOARD_COLONIES,
  DASHBOARD_ENS_NAMES,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

type ENSNameFromRouter = (state: RootStateRecord, props: Object) => ENSName;

export const ensNameFromRouter: ENSNameFromRouter = (state, props) =>
  props.match.params.ensName;

export const allColoniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES], ImmutableMap());

export const coloniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES], ImmutableMap());

export const coloniesListSelector = (state: RootStateRecord) =>
  coloniesSelector(state).toList();

export const colonyAvatarsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_AVATARS], ImmutableMap());

export const colonyENSNamesSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, DASHBOARD_ALL_COLONIES, DASHBOARD_ENS_NAMES],
    ImmutableMap(),
  );

export const routerColonySelector = createSelector(
  coloniesSelector,
  ensNameFromRouter,
  (colonies, ensName) => colonies.get(ensName),
);

export const singleColonySelector = (
  state: RootStateRecord,
  ensName: ENSName,
) => state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES, ensName]);

export const domainsIndexSelector = createSelector(
  singleColonySelector,
  colony =>
    colony ? colony.getIn(['record', 'databases', 'domainsIndex']) : undefined,
);

export const domainSelector = createSelector(
  (state, domainId) => domainId,
  singleColonySelector,
  (domainId, colony) =>
    colony ? colony.getIn(['record', 'domains', domainId]) : undefined,
);

export const colonyAvatarHashSelector = createSelector(
  coloniesSelector,
  (state, props) => props.ensName,
  (colonies, ensName) =>
    ensName ? colonies.getIn([ensName, 'record', 'avatar']) : null,
);

export const colonyAvatarDataSelector = createSelector(
  colonyAvatarHashSelector,
  state => state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_AVATARS]),
  (hash, state) => (state && hash ? state.get(hash) : null),
);

export const allColonyENSNames = createSelector(
  coloniesSelector,
  colonies => colonies.keySeq().toArray(), // TODO don't use a selector for this
);

export const colonyENSNameSelector = createSelector(
  colonyENSNamesSelector,
  (state, props) => props.colonyAddress,
  (ensNames, colonyAddress) => ensNames.get(colonyAddress),
);

/*
 * Checks (use for `given`)
 */
export const isInRecoveryMode = (colony: ColonyType) =>
  !!(colony && colony.inRecoveryMode);

export const canBeUpgraded = ({
  colony,
  network,
}: {
  colony: ColonyRecordType,
  network: NetworkProps,
}) =>
  colony &&
  network &&
  network.version &&
  colony.version &&
  network.version > colony.version;
