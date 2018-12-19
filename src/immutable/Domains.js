/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { RecordFactory, RecordOf } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { DomainRecord } from './Domain';
import type { TasksRecord } from './Tasks';
import type { DraftsRecord } from './Drafts';

type DomainId = number;

export type DomainsProps = {
  ensName: ImmutableMap<
    DomainId,
    {
      domain: DomainRecord,
      tasks: TasksRecord | DraftsRecord,
    },
  >,
};

export type DomainsRecord = RecordOf<DomainsProps>;

const defaultValues: DomainsProps = {
  ensName: new ImmutableMap(),
};

const Domains: RecordFactory<DomainsProps> = Record(defaultValues);

export default Domains;
