import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import { DomainType } from '~immutable/index';
import { Address } from '~types/index';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';

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

interface Props {
  domain: DomainType;
  colonyAddress: Address;
  cancel: () => void;
  close: (values: any) => void;
}

const displayName = 'core.DomainEditDialog';

const DomainEditDialog = ({ domain, colonyAddress, cancel, close }: Props) => {
  const handleSubmit = useCallback(
    ({ domainName }) =>
      close({ domainName, domainId: domain.id, colonyAddress }),
    [close, colonyAddress, domain.id],
  );

  return (
    <Dialog cancel={cancel}>
      <Form
        onSubmit={handleSubmit}
        initialValues={{
          domainName: domain.name,
        }}
      >
        {({ isSubmitting }: FormikProps<any>) => (
          <>
            <DialogSection>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                text={MSG.title}
              />
            </DialogSection>
            <DialogSection>
              <Input label={MSG.fieldLabel} name="domainName" />
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
      </Form>
    </Dialog>
  );
};

DomainEditDialog.displayName = displayName;

export default DomainEditDialog;
