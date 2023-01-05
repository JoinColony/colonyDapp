import { MessageDescriptor } from 'react-intl';

import {
  SignOption,
  VerificationStatus,
} from '~dashboard/DAOIncorporation/IncorporationForm/constants';
import { AnyUser } from '~data/index';

import { Stages } from './constants';

type Protector = AnyUser & {
  verified?: VerificationStatus;
};

export interface ValuesType {
  name: string;
  alternativeNames: string[];
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
  buttonTooltip?: MessageDescriptor;
}
