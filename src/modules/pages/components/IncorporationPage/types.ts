import { SignOption } from '~dashboard/DAOIncorporation/IncorporationForm/Protectors/Protectors';
import { AnyUser } from '~data/index';

export interface ValuesType {
  name: string;
  alternativeNames: string[];
  description: string;
  protectors?: AnyUser[];
  mainContact?: AnyUser;
  signOption: SignOption;
}
