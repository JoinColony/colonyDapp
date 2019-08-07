/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { ActionTypeString } from '~redux';
import type { ActionTransformFnType } from '~utils/actions';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel, Input } from '~core/Fields';
import Heading from '~core/Heading';

// import styles from './DomainEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.DomainEditDialog.title',
    defaultMessage: 'Edit Domain name',
  },
  fieldLabel: {
    id: 'core.DomainEditDialog.fieldLabel',
    defaultMessage: 'Domain name',
  },
  buttonCancel: {
    id: 'core.DomainEditDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'core.DomainEditDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
});

type Props = {|
  cancel: () => void,
  close: () => void,
  submit: ActionTypeString,
  success: ActionTypeString,
  error: ActionTypeString,
  transform?: ActionTransformFnType,
|};

const DomainEditDialog = ({
  cancel,
  close,
  submit,
  error,
  success,
  transform,
}: Props) => (
  <Dialog cancel={cancel}>
    <ActionForm
      onSuccess={close}
      submit={submit}
      error={error}
      success={success}
      transform={transform}
    >
      {({ isSubmitting }: FormikProps<*>) => (
        <>
          <DialogSection>
            <Heading
              appearance={{ size: 'medium', margin: 'none' }}
              text={MSG.title}
            />
          </DialogSection>
          <DialogSection>
            <InputLabel label={MSG.fieldLabel} />
            <Input name="domainName" />
          </DialogSection>
          <DialogSection appearance={{ align: 'right' }}>
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={cancel}
              text={MSG.buttonCancel}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              loading={isSubmitting}
              text={MSG.buttonConfirm}
              type="submit"
            />
          </DialogSection>
        </>
      )}
    </ActionForm>
  </Dialog>
);

DomainEditDialog.displayName = 'core.DomainEditDialog';

export default DomainEditDialog;
