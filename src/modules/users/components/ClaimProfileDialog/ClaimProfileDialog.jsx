/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Heading from '~core/Heading';
import CopyableAddress from '~core/CopyableAddress';
import MaskedAddress from '~core/MaskedAddress';
import Dialog, { DialogSection, DialogList } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import styles from './ClaimProfileDialog.css';

const MSG = defineMessages({
  title: {
    id: 'users.ClaimProfileDialog.title',
    defaultMessage: 'Welcome to Colony!',
  },
  subTitle: {
    id: 'users.ClaimProfileDialog.subTitle',
    defaultMessage: `Colony is a fully decentralized application (dApp) running
      on the Ethereum blockchain. Follow the steps below to set up your account
      and begin earning tokens and reputation in Colony.`,
  },
  stepTitle: {
    id: 'users.ClaimProfileDialog.stepTitle',
    defaultMessage: 'Step 1/3: Fund your account with ether',
  },
  stepText: {
    id: 'users.ClaimProfileDialog.stepText',
    defaultMessage: `Like other dApps, you’ll need some ether (ETH) in your
      wallet to cover transaction fees. Transactions are how you interact
      with the blockchain; the fees go to the miners
      who keep Ethereum running.`,
  },
  learnMore: {
    id: 'users.ClaimProfileDialog.learnMore',
    defaultMessage: 'Learn More',
  },
  iWillDoItLater: {
    id: 'users.ClaimProfileDialog.iWillDoItLater',
    defaultMessage: `I'll do it later`,
  },
  depositEther: {
    id: 'users.ClaimProfileDialog.depositEther',
    defaultMessage: 'Directly Deposit Ether',
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

const ClaimProfileDialog = ({ cancel, close, walletAddress }: Props) => {
  const listItems = [
    {
      title: MSG.depositEther,
      subtitle: <MaskedAddress address={walletAddress} />,
      icon: 'wallet',
      extra: (
        <CopyableAddress showAddress={false}>{walletAddress}</CopyableAddress>
      ),
    },
  ];

  return (
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
            <DialogSection appearance={{ border: 'bottom' }}>
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
            </DialogSection>
            <DialogSection>
              <div className={styles.titleAndButton}>
                <Heading
                  appearance={{
                    size: 'medium',
                    weight: 'bold',
                    margin: 'none',
                  }}
                  text={MSG.stepTitle}
                />
                <Button
                  appearance={{ theme: 'blue' }}
                  type="continue"
                  text={MSG.learnMore}
                />
              </div>
              <div className={styles.subTitle}>
                <Heading
                  appearance={{ size: 'normal', weight: 'thin' }}
                  text={MSG.stepText}
                />
              </div>
            </DialogSection>
            <DialogList items={listItems} />
            <DialogSection appearance={{ align: 'right' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.iWillDoItLater}
                onClick={cancel}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                appearance={{ size: 'large' }}
                text={{ id: 'button.confirm' }}
                loading={isSubmitting}
                disabled={!isValid}
              />
            </DialogSection>
          </Fragment>
        )}
      </ActionForm>
    </Dialog>
  );
};

export default ClaimProfileDialog;
