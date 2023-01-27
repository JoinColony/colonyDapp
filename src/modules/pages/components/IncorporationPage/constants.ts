import { nanoid } from 'nanoid';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { SignOption } from '~dashboard/Incorporation/IncorporationForm/constants';

import { StageObject, ValuesType } from './types';

const MSG = defineMessages({
  create: {
    id: 'dashboard.IncorporationPage.create',
    defaultMessage: 'Create Application',
  },
  createDesc: {
    id: 'dashboard.IncorporationPage.createDesc',
    defaultMessage: 'Propose DAO Incorporation',
  },
  createButtonText: {
    id: 'dashboard.IncorporationPage.createButtonText',
    defaultMessage: 'Submit',
  },
  collectiveInput: {
    id: 'dashboard.IncorporationPage.collectiveInput',
    defaultMessage: 'Collective Input',
  },
  collectiveInputDesc: {
    id: 'dashboard.IncorporationPage.collectiveInputDesc',
    defaultMessage: `Discuss whether to proceed with incorporation, nominate protectors, and submit protector verfication.`,
  },
  collectiveInputButtonText: {
    id: 'dashboard.IncorporationPage.collectiveInputButtonText',
    defaultMessage: 'Create motion',
  },
  payment: {
    id: 'dashboard.IncorporationPage.payment',
    defaultMessage: 'Payment',
  },
  paymentDesc: {
    id: 'dashboard.IncorporationPage.paymentDesc',
    defaultMessage: 'Create a Motion to pay for the agreed incorporation',
  },
  paymentButtonText: {
    id: 'dashboard.IncorporationPage.paymentButtonText',
    defaultMessage: 'Create motion',
  },
  processing: {
    id: 'dashboard.IncorporationPage.processing',
    defaultMessage: 'Processing',
  },
  processingDesc: {
    id: 'dashboard.IncorporationPage.processingDesc',
    defaultMessage: `Application has been submitted, the verification and registration is in progress.`,
  },
  complete: {
    id: 'dashboard.IncorporationPage.complete',
    defaultMessage: 'Create Application',
  },
  completeDesc: {
    id: 'dashboard.IncorporationPage.completeDesc',
    defaultMessage: 'Such DAO! So Incorporate!',
  },
  nameRequiredError: {
    id: 'dashboard.IncorporationPage.nameRequiredError',
    defaultMessage: 'Corporation name is required',
  },
  altNamesRequiredError: {
    id: 'dashboard.IncorporationPage.altNamesRequiredError',
    defaultMessage: 'Please provide alternative names',
  },
  purposeRequiredError: {
    id: 'dashboard.IncorporationPage.altNamesRequiredError',
    defaultMessage: 'Please explain the purpose of your DAO',
  },
  protectorRequiredError: {
    id: 'dashboard.IncorporationPage.altNamesRequiredError',
    defaultMessage: 'You need to nominate a protector',
  },
  lengthError: {
    id: 'dashboard.IncorporationPage.altNamesRequiredError',
    defaultMessage: 'Must have more than 2 letters',
  },
});

export const initialValues = {
  name: undefined,
  alternativeName1: undefined,
  alternativeName2: undefined,
  purpose: undefined,
  protectors: [
    { key: nanoid(), user: undefined },
    { key: nanoid(), user: undefined },
  ],
  mainContact: undefined,
  signOption: SignOption.Individual,
};

export const validationSchema = yup.object().shape({
  name: yup.string().required(() => MSG.nameRequiredError),
  alternativeName1: yup
    .string()
    .min(2, () => MSG.lengthError)
    .required(() => MSG.altNamesRequiredError),
  alternativeName2: yup
    .string()
    .min(2, () => MSG.lengthError)
    .required(() => MSG.altNamesRequiredError),
  purpose: yup
    .string()
    .min(3, () => MSG.lengthError)
    .max(90)
    .required(() => MSG.purposeRequiredError),
  protectors: yup
    .array()
    .of(
      yup.object().shape({
        user: yup.object().required(() => MSG.protectorRequiredError),
      }),
    )
    .min(1)
    .max(5),
  mainContact: yup.object().when('protectors', {
    is: (protectors) => {
      const selectedProtectors = protectors.filter(
        (protector) => !!protector.user,
      );
      return protectors?.length > 1 && selectedProtectors?.length > 1;
    },
    then: yup.object().required(() => MSG.protectorRequiredError),
  }),
  signOption: yup.string().when('protectors', {
    is: (protectors) => protectors?.length > 1,
    then: yup.string().required(() => MSG.protectorRequiredError),
  }),
});

export enum Stages {
  Draft,
  Created,
  Payment,
  Processing,
  Complete,
}

export const stages: StageObject[] = [
  {
    id: Stages.Draft,
    title: MSG.create,
    description: MSG.createDesc,
    buttonText: MSG.createButtonText,
  },
  {
    id: Stages.Created,
    title: MSG.collectiveInput,
    description: MSG.collectiveInputDesc,
    buttonText: MSG.collectiveInputButtonText,
  },
  {
    id: Stages.Payment,
    title: MSG.payment,
    description: MSG.paymentDesc,
    buttonText: MSG.paymentButtonText,
  },
  {
    id: Stages.Processing,
    title: MSG.processing,
    description: MSG.processingDesc,
  },
  { id: Stages.Complete, title: MSG.complete, description: MSG.completeDesc },
];

export const formValuesMock: ValuesType = {
  alternativeName1: 'WallStreetBets Foundation',
  alternativeName2: 'WallStreet Corp',
  mainContact: {
    id: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    profile: {
      avatarHash: null,
      displayName: null,
      username: 'Storm',
      walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    },
  },
  name: 'WallStreetBets',
  protectors: [
    {
      user: {
        id: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
        profile: {
          avatarHash: null,
          displayName: null,
          username: 'Storm',
          walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
        },
      },
      key: nanoid(),
    },
    {
      user: {
        id: 'filterValue',
        profile: { displayName: 'Ragnar', walletAddress: 'Ragnar' },
      },
      key: nanoid(),
    },
  ],
  purpose: `WallStreetBets is on a mission to deploy decentralized satellites in our skies.`,
  signOption: SignOption.Individual,
};
