import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import {
  Domain,
  FetchableData,
  DomainRecord,
  rolesFromJS,
  applyDomainRoleChanges,
} from '~immutable/index';
import { DomainRolesObject, ColonyRoles } from '~types/roles';
import { Address } from '~types/strings';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { AllDomainsMap } from '../state/index';

const allDomainsReducer: ReducerType<AllDomainsMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_ROLES_FETCH_SUCCESS: {
      const {
        meta: { key: colonyAddress },
        payload,
      } = action;

      const colonyDomains = state.getIn([colonyAddress, 'record']);

      if (!colonyDomains) {
        // If the given domain record is not set, it doesn't make sense to
        // only partially set it.
        return state;
      }

      return state.updateIn([colonyAddress, 'record'], record =>
        record.withMutations(
          (mutable: ImmutableMap<DomainRecord['id'], DomainRecord>) => {
            Object.entries(payload).forEach(
              ([domainId, roles]: [DomainRecord['id'], DomainRolesObject]) => {
                if (!mutable.has(domainId)) return;
                mutable.setIn([domainId, 'roles'], rolesFromJS(roles));
              },
            );
            return mutable;
          },
        ),
      );
    }
    case ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS:
    case ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS:
    case ActionTypes.COLONY_DOMAIN_USER_ROLES_SET: {
      const {
        payload: { colonyAddress, domainId, userAddress, roles },
      } = action;

      if (!state.getIn([colonyAddress, 'record', domainId])) return state;

      return state.updateIn(
        [colonyAddress, 'record', domainId, 'roles'],
        (domainRoles: ImmutableMap<Address, ImmutableSet<ColonyRoles>>) => {
          return domainRoles
            ? domainRoles.update(userAddress, userRoles =>
                applyDomainRoleChanges(userRoles || ImmutableSet(), roles),
              )
            : ImmutableMap([
                [userAddress, applyDomainRoleChanges(ImmutableSet(), roles)],
              ]);
        },
      );
    }
    case ActionTypes.DOMAIN_CREATE_SUCCESS: {
      const { colonyAddress, domain } = action.payload;
      const path = [colonyAddress, 'record'];
      return state.getIn(path)
        ? state.updateIn(
            path,
            domains => domains && domains.set(domain.id, Domain(domain)),
          )
        : state.set(
            colonyAddress,
            FetchableData({
              record: ImmutableMap([[domain.id, Domain(domain)]]),
            }),
          );
    }
    case ActionTypes.DOMAIN_EDIT_SUCCESS: {
      const {
        colonyAddress,
        domainName,
        domainId,
        parentId = null,
      } = action.payload;
      const path = [colonyAddress, 'record', domainId];
      return state.getIn(path)
        ? state.updateIn(
            path,
            domain => domain && domain.merge({ name: domainName, parentId }),
          )
        : state;
    }
    case ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload: { domains },
      } = action;
      return state.setIn(
        key,
        FetchableData({
          record: ImmutableMap(
            domains.map(domain => [
              domain.id,
              Domain({
                ...domain,
                // If the domain record is already set, ensure the roles are not modified
                roles: state.getIn([key, 'record', 'roles'], {}),
              }),
            ]),
          ),
        }),
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<
  AllDomainsMap,
  ImmutableMap<DomainRecord['id'], DomainRecord>
>(ActionTypes.COLONY_DOMAINS_FETCH, ImmutableMap())(allDomainsReducer);
