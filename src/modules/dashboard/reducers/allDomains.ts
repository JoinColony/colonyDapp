import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { Domain, FetchableData, DomainRecord } from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { AllDomainsMap } from '../state/index';

const allDomainsReducer: ReducerType<AllDomainsMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.DOMAIN_CREATE_SUCCESS: {
      const { colonyAddress, domain } = action.payload;
      const path = [colonyAddress, 'record'];
      return state.getIn(path)
        ? state.updateIn(
            path,
            domains => domains && domains.add(Domain(domain)),
          )
        : state.set(
            colonyAddress,
            FetchableData({
              record: ImmutableSet.of(Domain(domain)),
            }),
          );
    }
    case ActionTypes.DOMAIN_EDIT_SUCCESS: {
      const { colonyAddress, domainName, domainId, parentId } = action.payload;
      const path = [colonyAddress, 'record'];
      return state.updateIn(
        path,
        domains =>
          domains &&
          domains
            .filter(domain => domain.id !== domainId)
            .add(Domain({ id: domainId, name: domainName, parentId })),
      );
    }
    case ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload: { domains },
      } = action;
      return state.set(
        key,
        FetchableData({
          record: ImmutableSet(domains.map(domain => Domain(domain))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<AllDomainsMap, ImmutableSet<DomainRecord>>(
  ActionTypes.COLONY_DOMAINS_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
