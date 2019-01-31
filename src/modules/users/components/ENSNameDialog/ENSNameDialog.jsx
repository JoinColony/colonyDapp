/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment, Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { connect } from 'react-redux';
import BigNumber from 'bn.js';

import styles from './ENSNameDialog.css';

import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Button from '~core/Button';

import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, FormStatus } from '~core/Fields';

import promiseListener from '../../../../createPromiseListener';
import { currentUserBalanceSelector } from '../../selectors';

import {
  USERNAME_CREATE,
  USERNAME_CREATE_TX_CREATED,
  USERNAME_CREATE_ERROR,
  USERNAME_CHECK_AVAILABILITY,
  USERNAME_CHECK_AVAILABILITY_SUCCESS,
  USERNAME_CHECK_AVAILABILITY_ERROR,
} from '../../actionTypes';

const MSG = defineMessages({
  iWillDoItLater: {
    id: 'users.ENSNameDialog.iWillDoItLater',
    defaultMessage: `I'll do it later`,
  },
  inputLabel: {
    id: 'users.ENSNameDialog.inputLabel',
    defaultMessage: 'Enter a unique username',
  },
  stepTitle: {
    id: 'users.ENSNameDialog.stepTitle',
    defaultMessage: `Step {hasBalance, select,
      true {1/2}
      false {2/3}
    }: Choose your .user.joincolony.eth username`,
  },
  stepText: {
    id: 'users.ENSNameDialog.stepText',
    defaultMessage: `We’ll use this username to create a mapping between
      your wallet address, a distributed database, and the blockchain.
      Not only is the username necessary, it also enables {mention} and
      a {url} for your profile. Next, you’ll sign your first
      transaction and claim this username “on chain".`,
  },
  url: {
    id: 'users.ENSNameDialog.url',
    defaultMessage: 'personalized URL',
  },
  mention: {
    id: 'users.ENSNameDialog.mention',
    defaultMessage: '@mentions',
  },
  helpENSName: {
    id: 'users.ENSNameDialog.helpENSName',
    defaultMessage: 'Only use letters, numbers, and dashes',
  },
  errorDomainTaken: {
    id: 'users.ENSNameDialog.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
});

type FormValues = {
  ENSname: string,
};

type Props = {|
  balance: string,
  cancel: () => void,
  close: () => void,
|};

type State = {};

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

class ENSNameDialog extends Component<Props, State> {
  static displayName = 'users.ENSNameDialog';

  componentWillUnmount() {
    this.checkDomainTaken.unsubscribe();
  }

  checkDomainTaken = promiseListener.createAsyncFunction({
    start: USERNAME_CHECK_AVAILABILITY,
    resolve: USERNAME_CHECK_AVAILABILITY_SUCCESS,
    reject: USERNAME_CHECK_AVAILABILITY_ERROR,
  });

  validateDomain = async (values: FormValues) => {
    // 1. Validate with schema
    await validationSchema.validate(values).catch(err =>
      // eslint-disable-next-line no-console
      console.log(err),
    );

    // 2. Validate with saga
    try {
      await this.checkDomainTaken.asyncFunction(values);
    } catch (e) {
      const error = {
        username: MSG.errorDomainTaken,
      };
      throw error;
    }
  };

  render() {
    const { cancel, close, balance = '0' } = this.props;
    const bigNumberBalance = new BigNumber(balance);
    return (
      <Dialog cancel={cancel}>
        <ActionForm
          submit={USERNAME_CREATE}
          success={USERNAME_CREATE_TX_CREATED}
          error={USERNAME_CREATE_ERROR}
          validate={this.validateDomain}
          onSuccess={close}
        >
          {({ isValid, isSubmitting, status }: FormikProps<FormValues>) => (
            <Fragment>
              <DialogSection>
                <Heading
                  appearance={{ size: 'medium', margin: 'none' }}
                  text={MSG.stepTitle}
                  textValues={{
                    hasBalance: bigNumberBalance.gt(new BigNumber(0)),
                  }}
                />
              </DialogSection>
              <DialogSection>
                <div className={styles.sectionBody}>
                  <FormattedMessage
                    {...MSG.stepText}
                    values={{
                      url: (
                        <b>
                          <FormattedMessage {...MSG.url} />
                        </b>
                      ),
                      mention: (
                        <b>
                          <FormattedMessage {...MSG.mention} />
                        </b>
                      ),
                    }}
                  />
                </div>
              </DialogSection>
              <DialogSection>
                <Input
                  name="username"
                  label={MSG.inputLabel}
                  appearance={{ theme: 'fat' }}
                  extensionString=".user.joincolony.eth"
                  extra={<FormattedMessage {...MSG.helpENSName} />}
                />
              </DialogSection>
              <DialogSection appearance={{ align: 'right' }}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={MSG.iWillDoItLater}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  text={{ id: 'button.confirm' }}
                  disabled={!isValid}
                  type="submit"
                  loading={isSubmitting}
                />
              </DialogSection>
              <FormStatus status={status} />
            </Fragment>
          )}
        </ActionForm>
      </Dialog>
    );
  }
}

export default connect(state => ({
  balance: currentUserBalanceSelector(state),
}))(ENSNameDialog);
