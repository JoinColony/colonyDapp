/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_COLONIES,
  DASHBOARD_COLONY_NAMES,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

type ENSNameFromRouter = (state: RootStateRecord, props: Object) => ENSName;

/*
 * Input selectors
 */
export const colonyNameFromRouterSelector: ENSNameFromRouter = (state, props) =>
  props.match.params.colonyName;

export const allColoniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES], ImmutableMap());

export const coloniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES], ImmutableMap());

export const coloniesListSelector = (state: RootStateRecord) =>
  coloniesSelector(state).toList();

export const colonyNamesSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONY_NAMES],
    ImmutableMap(),
  );

/*
 * Selectors
 */
export const routerColonySelector = createSelector(
  coloniesSelector,
  colonyNameFromRouterSelector,
  (colonies, colonyName) => colonies.get(colonyName),
);

export const colonySelector = (state: RootStateRecord, colonyName: ENSName) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES, colonyName]);

export const domainSelector = createSelector(
  (state, domainId) => domainId,
  colonySelector,
  (domainId, colony) =>
    colony ? colony.getIn(['record', 'domains', domainId]) : undefined,
);

export const colonyAvatarHashSelector = createSelector(
  (state: RootStateRecord, colonyName: ENSName) => colonyName,
  coloniesSelector,
  (colonyName, colonies) => colonies.getIn([colonyName, 'record', 'avatar']),
);

export const allColonyNamesSelector = createSelector(
  coloniesSelector,
  colonies => colonies.keySeq(),
);

export const colonyNameSelector = createSelector(
  colonyNamesSelector,
  (state, props) => props.colonyAddress, // TODO use a string argument
  (colonyNames, colonyAddress) => colonyNames.get(colonyAddress),
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
