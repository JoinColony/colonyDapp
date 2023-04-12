import { ValuesType } from '~pages/IncorporationPage/types';

import { ValueOf } from './ChangedValues/ChangedValues';

export type NewValueType = {
  id: string;
  key: string;
  value?: ValueOf<ValuesType>;
};
