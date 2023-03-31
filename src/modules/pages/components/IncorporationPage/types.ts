import { MessageDescriptor } from 'react-intl';

import {
  SignOption,
  VerificationStatus,
} from '~dashboard/Incorporation/IncorporationForm/constants';
import { AnyUser } from '~data/index';

import { Stages } from './constants';

type Protector = AnyUser & {
  verified?: VerificationStatus;
};

export interface Protector {
  user?: AnyUser;
  key: string;
  removed?: boolean;
  created?: boolean;
  verified?: VerificationStatus;
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
