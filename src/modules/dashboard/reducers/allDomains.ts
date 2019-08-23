import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import {
  DomainRecord,
  DataRecord,
  AllDomainsMap,
  DomainRecordType,
} from '~immutable/index';
import { withDataRecordMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

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
            domains => domains && domains.add(DomainRecord(domain)),
          )
        : state.set(
            colonyAddress,
            DataRecord({
              record: ImmutableSet.of(DomainRecord(domain)),
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
            .add(DomainRecord({ id: domainId, name: domainName, parentId })),
      );
    }
    case ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload: { domains },
      } = action;
      return state.set(
        key,
        DataRecord({
          record: ImmutableSet(domains.map(domain => DomainRecord(domain))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllDomainsMap, ImmutableSet<DomainRecordType>>(
  ActionTypes.COLONY_DOMAINS_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
