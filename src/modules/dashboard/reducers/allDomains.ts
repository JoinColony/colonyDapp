import { Map as ImmutableMap } from 'immutable';

import {
  Domain,
  DomainRolesType,
  FetchableData,
  DomainRecord,
} from '~immutable/index';
import { DomainsMap } from '~types/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { AllDomainsMap } from '../state/index';

const allDomainsReducer: ReducerType<AllDomainsMap> = (
  state = ImmutableMap() as AllDomainsMap,
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
        record.withMutations((mutable: DomainsMap) => {
          Object.entries(payload).forEach(
            // string because Object.entries casts to string
            ([domainId, roles]: [string, DomainRolesType]) => {
              const oldDomain = mutable.get(parseInt(domainId, 10));
              if (!oldDomain) return;
              const domain = Domain({
                ...oldDomain.toJS(),
                roles,
              });
              mutable.set(parseInt(domainId, 10), domain);
            },
          );
          return mutable;
        }),
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
            FetchableData<any>({
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
      return state.set(
        key,
        FetchableData({
          record: ImmutableMap(
            domains.map(domain => [
              domain.ethDomainId,
              Domain({
                ...domain,
                id: domain.ethDomainId,
                parentId: domain.parent ? domain.parent.ethDomainId : undefined,
                // If the domain record is already set, ensure the roles are not modified
                roles: state.getIn(
                  [key, 'record', domain.ethDomainId, 'roles'],
                  {},
                ),
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
>(ActionTypes.COLONY_DOMAINS_FETCH, ImmutableMap() as AllDomainsMap)(
  allDomainsReducer,
);
