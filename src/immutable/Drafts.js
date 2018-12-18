/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { DraftRecord } from './Draft';

type DraftId = string;

export type DraftsProps = {
  drafts: ImmutableMap<DraftId, DraftRecord>,
};

export type DraftsRecord = RecordOf<DraftsProps>;

const defaultValues: DraftsProps = {
  drafts: new ImmutableMap(),
};

const Drafts: RecordFactory<DraftsProps> = Record(defaultValues);

export default Drafts;
