/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
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
  buyEther: {
    id: 'users.ClaimProfileDialog.buyEther',
    defaultMessage: 'Buy Ether on Coinbase',
  },
  continue: {
    id: 'users.ClaimProfileDialog.continue',
    defaultMessage: 'Continue to Coinbase',
  },
  depositWallet: {
    id: 'users.ClaimProfileDialog.depositWallet',
    defaultMessage: 'And deposit into your wallet',
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
      subtitleElement: <MaskedAddress address={walletAddress} />,
      icon: 'wallet',
      extra: <CopyableAddress hideAddress>{walletAddress}</CopyableAddress>,
    },
    {
      title: MSG.buyEther,
      subtitleElement: (
        <Heading
          appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
          text={MSG.depositEther}
        />
      ),
      imageUrl:
        'data:image/svg+xml;base64,PHN2ZyBpZD0ibG9nbyIgd2lkdGg9IjM1MCIgaGVpZ2h0PSI3Ni4wMDIiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbC1ydWxlPSJldmVub2RkIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDM1MCA3Ni4wMDIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxtZXRhZGF0YT48cmRmOnJkZj48Y2M6d29yayByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIvPjxkYzp0aXRsZS8+PC9jYzp3b3JrPjwvcmRmOnJkZj48L21ldGFkYXRhPjxnIHRyYW5zZm9ybT0ibWF0cml4KC4wNDM1NTQgMCAwIC4wNDM1NTQgMCAuMzQ4NDMpIj48cGF0aCBkPSJtNzU0MSA2ODJjLTE4NCAwLTMwNSAxNDAtMzA5IDM4Nmw1NzItNzljLTItMjA2LTEwNS0zMDctMjYzLTMwN3ptNDkzIDM4M3YtNTZjLTYtMzA4LTE4Ny01MDItNDg4LTUwMi0zMzEgMC01MzIgMjUyLTUzMiA2MTMgMCAzNzcgMjA4IDYxNiA1ODEgNjE2IDE2MiAwIDMyMC0zNSA0MTItODNsLTcwLTE4MGMtODEgNDQtMjA4IDcyLTMyNiA3Mi0xOTkgMC0zMzctMTA3LTM2MS0zMjBsNzg0LTExMGMxLTE3IDItMzQgMi01MXptLTE2MjYgNjcxYy0xMzggMC0yODMtMzctMzY4LTgzbDgxLTE4NGM2MSAzNyAxOTEgNzcgMjgwIDc3IDEyOSAwIDIxNS02NCAyMTUtMTYyIDAtMTA3LTkwLTE0OS0yMTAtMTkzLTE1OC01OS0zMzUtMTMxLTMzNS0zNTMgMC0xOTUgMTUxLTMzMSA0MTQtMzMxIDE0MiAwIDI2MSAzNSAzNDQgODNsLTc0IDE2N2MtNTMtMzMtMTU4LTcwLTI0My03MC0xMjUgMC0xOTUgNjYtMTk1IDE1MSAwIDEwNyA4OCAxNDUgMjA0IDE4OCAxNjQgNjEgMzQ2IDEyOSAzNDYgMzU5IDAgMjEzLTE2MiAzNTEtNDU4IDM1MXptLTc2Ny02MThjLTI0MSAxMy00ODIgMzMtNDgyIDI0MyAwIDEyNSA5NiAyMDIgMjc4IDIwMiA3NyAwIDE2Ny0xMyAyMDQtMzF6bS0xOTcgNjE4Yy0zNDAgMC01MTAtMTM4LTUxMC0zNzAgMC0zMjkgMzUxLTM4OCA3MDgtNDA3di03NGMwLTE0OS05OS0yMDItMjUwLTIwMi0xMTIgMC0yNDggMzUtMzI2IDcybC02MS0xNjRjOTQtNDIgMjU0LTgzIDQxMi04MyAyODMgMCA0NTQgMTEwIDQ1NCA0MDF2NzQ1Yy04NSA0Ni0yNTkgODMtNDI1IDgzem0tMTIwMy0xMDM2Yy02NiAwLTE0MiAxNS0xODggMzl2Nzc2YzM1IDE1IDEwMyAzMSAxNzEgMzEgMTkxIDAgMzMxLTEzMSAzMzEtNDM0IDAtMjU5LTEyMy00MTItMzEzLTQxMnptLTMxIDEwMzZjLTE1MyAwLTMwNS0zNy0zOTctODN2LTE2NjFoMjM5djU3MGM1Ny0yNiAxNDktNDggMjMwLTQ4IDMwNSAwIDUxMCAyMTkgNTEwIDU4MSAwIDQ0NS0yMzAgNjQyLTU4MyA2NDJ6bS04NzYtMjR2LTc4OWMwLTEzOC04My0yMjMtMjQ4LTIyMy04OCAwLTE2OSAxNS0yMTcgMzV2OTc3aC0yMzl2LTExMjJjMTE4LTQ4IDI2OS04MyA0NTMtODMgMzMxIDAgNDkxIDE0NSA0OTEgMzk0djgxMWgtMjQxem0tMTE4OSAwdi0xMTgxaDI0MXYxMTgxem0xMjAtMTM5NmMtNzkgMC0xNDItNjEtMTQyLTEzNiAwLTc0IDY0LTEzNiAxNDItMTM2IDc5IDAgMTQyIDYxIDE0MiAxMzYgMCA3NC02NCAxMzYtMTQyIDEzNnptLTg0MSAzODJjLTE4NiAwLTI3OCAxNjctMjc4IDQyMXM5MiA0MjMgMjc4IDQyMyAyNzgtMTY5IDI3OC00MjMtOTItNDIxLTI3OC00MjF6bTAgMTAzOGMtMzM1IDAtNTE5LTI2NS01MTktNjE2czE4NC02MTMgNTE5LTYxMyA1MTkgMjYzIDUxOSA2MTNjMCAzNTEtMTg0IDYxNi01MTkgNjE2em0tOTA1IDBjLTI2MyAwLTUxOS0xODgtNTE5LTYxNiAwLTQyNyAyNTYtNjEzIDUxOS02MTMgMTI5IDAgMjMwIDMzIDMwMiA4MWwtNzkgMTczYy00OC0zNS0xMjAtNTctMTkzLTU3LTE1OCAwLTMwMiAxMjUtMzAyIDQxNHMxNDkgNDE2IDMwMiA0MTZjNzIgMCAxNDUtMjIgMTkzLTU3bDc5IDE3N2MtNzQgNTAtMTczIDgxLTMwMiA4MXoiIGZpbGw9IiMwMDgyYmYiLz48L2c+PC9zdmc+',
      extra: (
        <ExternalLink
          className={styles.link}
          text={MSG.continue}
          href="https://coinbase.com"
        />
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
