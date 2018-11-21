/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Heading from '~core/Heading';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import styles from './ENSNameDialog.css';

const MSG = defineMessages({
  title: {
    id: 'users.ENSNameDialog.title',
    defaultMessage: 'Welcome to Colony!',
  },
  subTitle: {
    id: 'users.ENSNameDialog.subTitle',
    defaultMessage: `Colony is a fully decentralized application (dApp) running
      on the Ethereum blockchain. Follow the steps below to set up your account
      and begin earning tokens and reputation in Colony.`,
  },
  stepTitle: {
    id: 'users.ENSNameDialog.stepTitle',
    defaultMessage: 'Step 1/3: Fund your account with ether',
  },
  stepText: {
    id: 'users.ENSNameDialog.stepText',
    defaultMessage: `Like other dApps, you’ll need some ether (ETH) in your
      wallet to cover transaction fees. Transactions are how you interact
      with the blockchain; the fees go to the miners
      who keep Ethereum running.`,
  },
});

type FormValues = {};

type Props = {
  cancel: () => void,
  close: () => void,
  walletAddress: string,
} & FormikProps<FormValues>;

const validationSchema = yup.object({
  ensname: yup
    .string()
    .required()
    .username(),
});

const ENSNameDialog = ({ cancel, close, walletAddress }: Props) => (
  <Dialog cancel={cancel}>
    <ActionForm
      submit="ENS_NAME_CREATE"
      success="ENS_NAME_CREATE_SUCCESS"
      error="ENS_NAME_CREATE_ERROR"
      validationSchema={validationSchema}
      onSuccess={close}
    >
      {({ isSubmitting, isValid }) => (
        <Fragment>
          <div className={styles.title}>
            <Heading
              appearance={{ size: 'medium', weight: 'bold' }}
              text={MSG.title}
            />
          </div>
          <div className={styles.subTitle}>
            <Heading
              appearance={{ size: 'normal', weight: 'thin' }}
              text={MSG.subTitle}
            />
          </div>
        </Fragment>
      )}
    </ActionForm>
  </Dialog>
);

export default ENSNameDialog;
