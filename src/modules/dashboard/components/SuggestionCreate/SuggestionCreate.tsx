import React, { useCallback, useRef } from 'react';
import { FormikHelpers } from 'formik';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { useHistory } from 'react-router';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { Form, Input } from '~core/Fields';
import {
  Domain,
  useCreateSuggestionMutation,
  ColonySuggestionsDocument,
  ColonySuggestionsQueryVariables,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';
import unfinishedProfileOpener from '~users/UnfinishedProfile';

const MSG = defineMessages({
  inputLabelTitle: {
    id: 'Dashboard.SuggestionCreate.inputLabelTitle',
    defaultMessage: 'Suggest features, report bugs, or propose tasks',
  },
});

interface FormValues {
  title: string;
}

interface Props {
  colonyAddress: Address;
  domainId: Domain['ethDomainId'];
}

const validationSchema = yup.object({
  title: yup.string().required(),
});

const displayName = 'Dashboard.SuggestionCreate';

const SuggestionCreate = ({ colonyAddress, domainId }: Props) => {
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const { username } = useLoggedInUser();

  const [createSuggestion] = useCreateSuggestionMutation();

  const handleUnclaimedProfile = useCallback(() => {
    if (!username) {
      unfinishedProfileOpener(history);
    }
  }, [history, username]);

  const handleSubmit = useCallback(
    async ({ title }: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      // Suggestion must be associated with an actual domain
      const ethDomainId =
        domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID ? ROOT_DOMAIN : domainId;
      await createSuggestion({
        variables: { input: { colonyAddress, ethDomainId, title } },
        refetchQueries: [
          {
            query: ColonySuggestionsDocument,
            variables: { colonyAddress } as ColonySuggestionsQueryVariables,
          },
        ],
      });
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
      }
      resetForm();
    },
    [domainId, createSuggestion, colonyAddress],
  );

  return (
    <Form
      initialValues={{ title: '' } as FormValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <div onFocus={handleUnclaimedProfile}>
        <Input
          appearance={{ theme: 'fat' }}
          innerRef={inputRef}
          label={MSG.inputLabelTitle}
          name="title"
        />
      </div>
    </Form>
  );
};

SuggestionCreate.displayName = displayName;

export default SuggestionCreate;
