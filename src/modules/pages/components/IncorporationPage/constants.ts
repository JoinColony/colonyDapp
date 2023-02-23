import { nanoid } from 'nanoid';

import { SignOption } from '~dashboard/Incorporation/IncorporationForm/types';

export const initialValues = {
  name: undefined,
  alternativeName1: undefined,
  alternativeName2: undefined,
  purpose: undefined,
  protectors: [{ key: nanoid(), user: undefined }],
  mainContact: undefined,
  signOption: SignOption.Individual,
  description: undefined,
};
