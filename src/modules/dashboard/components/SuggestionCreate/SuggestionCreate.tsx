import React, { useCallback, FC, useRef } from 'react';
import { FormikHelpers } from 'formik';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { Form, Input } from '~core/Fields';
import { withDialog } from '~core/Dialog';
import { OpenDialog } from '~core/Dialog/types';
import {
  Domain,
  useCreateSuggestionMutation,
  ColonySuggestionsDocument,
  ColonySuggestionsQueryVariables,
} from '~data/index';
import { Address } from '~types/index';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [createSuggestion] = useCreateSuggestionMutation();

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
          createSuggestion({
            variables: { input: { colonyAddress, ethDomainId, title } },
            refetchQueries: [
              {
                query: ColonySuggestionsDocument,
                variables: { colonyAddress } as ColonySuggestionsQueryVariables,
              },
            ],
          }).then(() => {
            if (inputRef && inputRef.current) {
              inputRef.current.blur();
            }
            resetForm();
          });
        });
    },
    [openDialog, domainId, createSuggestion, colonyAddress],
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
        innerRef={inputRef}
      />
    </Form>
  );
};

SuggestionCreate.displayName = displayName;

export default (withDialog() as any)(SuggestionCreate) as FC<InProps>;
