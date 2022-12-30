import * as yup from 'yup';

import { SignOption } from '~dashboard/DAOIncorporation/IncorporationForm/Protectors/Protectors';

export const initialValues = {
  name: undefined,
  alternativeNames: ['', ''],
  purpose: undefined,
  description: undefined,
  protectors: [undefined],
  mainContact: undefined,
  signOption: SignOption.Individual,
};

export const validationSchema = yup.object().shape({
  name: yup.string().required(),
  alternativeNames: yup.array().of(yup.string()).min(2).max(2),
  description: yup.string().required(),
  protectors: yup.array().min(1).max(5),
  mainContact: yup.object().required(),
  signOption: yup.string(),
  purpose: yup.string(),
});
