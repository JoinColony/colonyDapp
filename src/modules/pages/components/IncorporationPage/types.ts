import { SignOption } from '~dashboard/Incorporation/IncorporationForm/types';
import { AnyUser } from '~data/index';

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
