/* @flow */

import React, { Component } from 'react';
import compose from 'recompose/compose';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';
import type { OpenDialog } from '~core/Dialog/types';
import type { UserType } from '~immutable';
import type { IBrowserHistory } from 'history';

import { withImmutablePropsToJS } from '~utils/hoc';
import { unfinishedProfileOpener } from '~users/UnfinishedProfileDialog';

import { withCurrentUser } from '../../../hocs';

import { ActionForm, Input, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepDisplayName.css';
import { ACTIONS } from '~redux';

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
  currentUser: UserType,
  history: IBrowserHistory,
};

type State = {};

const displayName = 'users.ConnectWalletWizard.StepDisplayName';

class StepDisplayName extends Component<Props, State> {
  progressWithDialog = () => {
    const { history } = this.props;
    return unfinishedProfileOpener(history);
  };

  render() {
    const { wizardForm, previousStep } = this.props;
    return (
      <ActionForm
        submit={ACTIONS.USER_PROFILE_UPDATE}
        error={ACTIONS.USER_PROFILE_UPDATE_ERROR}
        success={ACTIONS.USER_PROFILE_UPDATE_SUCCESS}
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
                /**
                 * @todo Fix connect wallet wizard success handling.
                 * @body the nextStep should be called onSuccess once the wizard is working again
                 */
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

export default compose(
  withCurrentUser,
  withImmutablePropsToJS,
)(StepDisplayName);
