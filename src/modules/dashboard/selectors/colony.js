/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_COLONIES,
  DASHBOARD_ENS_NAMES,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

type ENSNameFromRouter = (state: RootStateRecord, props: Object) => ENSName;

/*
 * Input selectors
 */
export const ensNameFromRouterSelector: ENSNameFromRouter = (state, props) =>
  props.match.params.ensName;

export const allColoniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES], ImmutableMap());

export const coloniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES], ImmutableMap());

export const coloniesListSelector = (state: RootStateRecord) =>
  coloniesSelector(state).toList();

export const colonyENSNamesSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, DASHBOARD_ALL_COLONIES, DASHBOARD_ENS_NAMES],
    ImmutableMap(),
  );

/*
 * Selectors
 */
export const routerColonySelector = createSelector(
  coloniesSelector,
  ensNameFromRouterSelector,
  (colonies, ensName) => colonies.get(ensName),
);

export const colonySelector = (state: RootStateRecord, ensName: ENSName) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES, ensName]);

export const domainSelector = createSelector(
  (state, domainId) => domainId,
  colonySelector,
  (domainId, colony) =>
    colony ? colony.getIn(['record', 'domains', domainId]) : undefined,
);

export const colonyAvatarHashSelector = createSelector(
  (state: RootStateRecord, ensName: ENSName) => ensName,
  coloniesSelector,
  (ensName, colonies) => colonies.getIn([ensName, 'record', 'avatar']),
);

export const allColonyENSNamesSelector = createSelector(
  coloniesSelector,
  colonies => colonies.keySeq(),
);

export const colonyENSNameSelector = createSelector(
  colonyENSNamesSelector,
  (state, props) => props.colonyAddress, // TODO use a string argument
  (ensNames, colonyAddress) => ensNames.get(colonyAddress),
);

export const colonyNativeTokenSelector = createSelector(
  colonySelector,
  colony =>
    colony
      ? colony
          .getIn(['record', 'tokens'], ImmutableMap())
          .find(token => !!token && token.isNative)
      : null,
);
