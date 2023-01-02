import { MessageDescriptor } from 'react-intl';

import { SignOption } from '~dashboard/DAOIncorporation/IncorporationForm/Protectors/Protectors';
import { AnyUser } from '~data/index';

import { Stages } from './constants';

export interface ValuesType {
  name: string;
  alternativeNames: string[];
  purpose: string;
  protectors?: AnyUser[];
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
