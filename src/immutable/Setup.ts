import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

export interface SetupProps {
  contextSagasLoaded: boolean;
}

const defaultValues: DefaultValues<SetupProps> = {
  contextSagasLoaded: false,
};

export class SetupRecord extends Record<SetupProps>(defaultValues)
  implements RecordToJS<SetupProps> {}

export const Setup = (p?: SetupProps) => new SetupRecord(p);
