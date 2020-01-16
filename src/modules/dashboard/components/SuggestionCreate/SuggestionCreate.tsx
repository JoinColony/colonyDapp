import React, { useCallback, FC } from 'react';
import { FormikHelpers } from 'formik';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { Address } from '~types/index';
import { Form, Input } from '~core/Fields';
import { withDialog } from '~core/Dialog';
import { OpenDialog } from '~core/Dialog/types';
import { Domain } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';

const MSG = defineMessages({
  inputLabelTitle: {
    id: 'Dashboard.SuggestionCreate.inputLabelTitle',
    defaultMessage: 'Suggest features, report bugs, or propose tasks',
  },
});

interface FormValues {
  title: string;
}

interface InProps {
  colonyAddress: Address;
  domainId: Domain['ethDomainId'];
}

interface Props extends InProps {
  // Injected via `withDialog`
  openDialog: OpenDialog;
}

const validationSchema = yup.object({
  title: yup.string().required(),
});

const displayName = 'Dashboard.SuggestionCreate';

const SuggestionCreate = ({ colonyAddress, domainId, openDialog }: Props) => {
  const handleSubmit = useCallback(
    ({ title }: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      openDialog('ConfirmDialog')
        .afterClosed()
        .then(() => {
          // Suggestion must be associated with an actual domain
          const ethDomainId =
            domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
              ? ROOT_DOMAIN
              : domainId;
          // @todo Use createSuggestionMutation
          // eslint-disable-next-line no-console
          console.log(title, colonyAddress, ethDomainId);
          resetForm();
        });
    },
    [colonyAddress, openDialog, domainId],
  );
  return (
    <Form
      initialValues={{ title: '' } as FormValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Input
        appearance={{ theme: 'fat' }}
        label={MSG.inputLabelTitle}
        name="title"
      />
    </Form>
  );
};

SuggestionCreate.displayName = displayName;

export default (withDialog() as any)(SuggestionCreate) as FC<InProps>;
