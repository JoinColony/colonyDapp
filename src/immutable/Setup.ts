import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

export interface SetupProps {
  /**
   * @NOTE This is needed in oreder to inform the app that all listeners that we
   * depend on were set up.
   * Otherwise we run into race conditions where actions are dispatched but there's
   * no listener set up yet to handle it. (eg: fetch user address)
   */
  contextSagasLoaded: boolean;
}

const defaultValues: DefaultValues<SetupProps> = {
  contextSagasLoaded: false,
};

export class SetupRecord extends Record<SetupProps>(defaultValues)
  implements RecordToJS<SetupProps> {}

export const Setup = (p?: SetupProps) => new SetupRecord(p);
