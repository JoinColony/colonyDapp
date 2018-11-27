/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Button from '~core/Button';

import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

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
    defaultMessage: 'Step 2/3: Choose your .joincolony.eth username',
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
});

type FormValues = {
  ENSname: string,
};

type Props = {
  cancel: () => void,
  close: () => void,
} & FormikProps<FormValues>;

const validationSchema = yup.object({
  // TODO: Validate ENS name further by checking blacklist, check also if unique
  // and if there's incorrect characters etc.
  ENSname: yup.string().required(),
});

const displayName = 'users.ENSNameDialog';

const ENSNameDialog = ({ cancel, close }: Props) => (
  <Dialog cancel={cancel}>
    <ActionForm
      submit="ENS_NAME_CREATE"
      success="ENS_NAME_CREATE_SUCCESS"
      error="ENS_NAME_CREATE_ERROR"
      validationSchema={validationSchema}
      onSuccess={close}
    >
      {isValid => (
        <Fragment>
          <DialogSection>
            <Heading
              appearance={{ size: 'medium', margin: 'none' }}
              text={MSG.stepTitle}
            />
          </DialogSection>
          <DialogSection>
            <Heading
              appearance={{ size: 'normal', weight: 'thin' }}
              text={MSG.stepText}
            >
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
            </Heading>
          </DialogSection>
          <DialogSection>
            <Input
              name="ENSname"
              label={MSG.inputLabel}
              appearance={{ theme: 'fat' }}
              extensionString=".joincolony.eth"
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
              onClick={close}
              text={{ id: 'button.confirm' }}
              disabled={!isValid}
            />
          </DialogSection>
        </Fragment>
      )}
    </ActionForm>
  </Dialog>
);

ENSNameDialog.displayName = displayName;

export default ENSNameDialog;
