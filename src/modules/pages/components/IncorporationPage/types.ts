import { MessageDescriptor } from 'react-intl';

import { SignOption } from '~dashboard/Incorporation/IncorporationForm/types';
import { AnyUser } from '~data/index';

import { Stages } from './constants';

export interface Protector {
  user?: AnyUser;
  key: string;
  removed?: boolean;
  created?: boolean;
}
export interface ValuesType {
  name: string;
  alternativeName1: string;
  alternativeName2: string;
  purpose: string;
  protectors?: Protector[];
  mainContact?: AnyUser;
  signOption: SignOption;
}

export interface StageObject {
  id: Stages;
  title: MessageDescriptor;
  description: MessageDescriptor;
  buttonText?: MessageDescriptor;
}
