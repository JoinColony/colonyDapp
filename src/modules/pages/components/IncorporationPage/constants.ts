import { nanoid } from 'nanoid';
import { defineMessages } from 'react-intl';

import { SignOption } from '~dashboard/Incorporation/IncorporationForm/types';

import { StageObject } from './types';

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
});

export const initialValues = {
  name: undefined,
  alternativeName1: undefined,
  alternativeName2: undefined,
  purpose: undefined,
  protectors: [{ key: nanoid(), user: undefined }],
  mainContact: undefined,
  signOption: SignOption.Individual,
};

export enum Stages {
  Draft = 'Draft',
  Created = 'Created',
  Payment = 'Payment',
  Processing = 'Processing',
  Complete = 'Complete',
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
