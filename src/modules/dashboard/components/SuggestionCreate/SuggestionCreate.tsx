import React, { useCallback, useRef } from 'react';
import { FormikHelpers } from 'formik';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import Button from '~core/Button';
import { Form, Input } from '~core/Fields';
import {
  ColonySuggestionsDocument,
  ColonySuggestionsQueryVariables,
  Domain,
  useCreateSuggestionMutation,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';
import unfinishedProfileOpener from '~users/UnfinishedProfile';

import styles from './SuggestionCreate.css';

const MSG = defineMessages({
  buttonCreateSuggestion: {
    id: 'Dashboard.SuggestionCreate.buttonCreateSuggestion',
    defaultMessage: 'Create Suggestion',
  },
  formErrorText: {
    id: 'Dashboard.SuggestionCreate.formErrorText',
    defaultMessage: 'There was an error creating your suggestion.',
  },
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
      {({ dirty, isSubmitting, isValid }) => (
        <div className={styles.horizontalForm} onFocus={handleUnclaimedProfile}>
          <div className={styles.formItem}>
            <Input
              appearance={{ theme: 'fat' }}
              innerRef={inputRef}
              label={MSG.inputLabelTitle}
              name="title"
            />
          </div>
          <div className={styles.formItem}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={MSG.buttonCreateSuggestion}
              type="submit"
              disabled={!isValid || isSubmitting || !dirty}
              loading={isSubmitting}
            />
          </div>
        </div>
      )}
    </Form>
  );
};

SuggestionCreate.displayName = displayName;

export default SuggestionCreate;
