/* @flow */

import type { FormikProps } from 'formik';

import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import type { ActionTypeString } from '~redux';
import type { ActionTransformFnType } from '~utils/actions';

import { pipe, mergePayload, withKey } from '~utils/actions';
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
  domain,
  colonyAddress,
  cancel,
  close,
  submit,
  error,
  success,
}: Props) => {
  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress],
  );
  return (
    <Dialog cancel={cancel}>
      <ActionForm
        onSuccess={close}
        submit={submit}
        error={error}
        success={success}
        transform={transform}
        initialValues={{
          domainName: domain.name,
          domainId: domain.id,
        }}
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
};

DomainEditDialog.displayName = 'core.DomainEditDialog';

export default DomainEditDialog;
