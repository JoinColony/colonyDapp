/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';
import type { OpenDialog } from '~core/Dialog/types';

import {
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
} from '../../../actionTypes';

import { ActionForm, Input, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepDisplayName.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepDisplayName.heading',
    defaultMessage: `Congrats, your wallet is set up.
      Let's finish your account!`,
  },
  instructionText: {
    id: 'users.ConnectWalletWizard.StepDisplayName.instructionText',
    defaultMessage: 'Add a name so people can identify you within Colony.',
  },
  label: {
    id: 'users.ConnectWalletWizard.StepDisplayName.label',
    defaultMessage: 'Your Name',
  },
  errorDescription: {
    id: 'users.ConnectWalletWizard.StepDisplayName.errorDescription',
    defaultMessage: 'Oops, there is something wrong',
  },
  errorUsername: {
    id: 'users.ConnectWalletWizard.StepDisplayName.errorOpenMnemonic',
    defaultMessage:
      'Oops, there is something wrong. Check the format of your username',
  },
  displayNameRequired: {
    id: 'users.ConnectWalletWizard.StepDisplayName.displayNameRequired',
    defaultMessage: 'You must provide a username.',
  },
  buttonAdvanceText: {
    id: 'users.ConnectWalletWizard.StepDisplayName.button.advance',
    defaultMessage: 'Launch App',
  },
  buttonBackText: {
    id: 'users.ConnectWalletWizard.StepDisplayName.button.back',
    defaultMessage: 'Back',
  },
});

const validationSchema = yup.object({
  displayName: yup.string().required(MSG.displayNameRequired),
});

type FormValues = {
  displayName: string,
};

type Props = WizardProps<FormValues> & {
  openDialog: OpenDialog,
  user: { walletAddress: string },
};

type State = {};

const displayName = 'users.ConnectWalletWizard.StepDisplayName';

class StepDisplayName extends Component<Props, State> {
  progressWithDialog = () => {
    const { openDialog, user } = this.props;
    return openDialog('UnfinishedProfileDialog')
      .afterClosed()
      .then(() =>
        openDialog('ClaimProfileDialog', {
          walletAddress: user ? user.walletAddress : '',
        })
          .afterClosed()
          .then(() => openDialog('ENSNameDialog'))
          .catch(err => {
            // eslint-disable-next-line no-console
            console.log(err);
          }),
      );
  };

  render() {
    const { wizardForm, previousStep } = this.props;
    return (
      <ActionForm
        submit={USER_PROFILE_UPDATE}
        error={USER_PROFILE_UPDATE_ERROR}
        success={USER_PROFILE_UPDATE_SUCCESS}
        onSuccess={() => {}}
        validationSchema={validationSchema}
        {...wizardForm}
      >
        {({ isValid, isSubmitting, status, values }) => (
          <main>
            <div className={styles.content}>
              <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
              <div className={styles.marginTop}>
                <FormattedMessage {...MSG.instructionText} />
              </div>
              <div className={styles.marginTop}>
                <Input label={MSG.label} name="displayName" />
              </div>
            </div>
            <FormStatus status={status} />
            <div className={styles.actions}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.buttonBackText}
                onClick={() => previousStep(values)}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                disabled={!isValid}
                text={MSG.buttonAdvanceText}
                type="submit"
                // TODO: the nextStep should be called onSucces once wizard is working again
                onClick={() => this.progressWithDialog()}
                loading={isSubmitting}
              />
            </div>
          </main>
        )}
      </ActionForm>
    );
  }
}

StepDisplayName.displayName = displayName;

const enhance = connect(({ user }) => ({
  user,
}));

export default enhance(StepDisplayName);
