import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardProps } from '~core/Wizard';
import { mergePayload } from '~utils/actions';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import CardRow, { Row } from './CreateColonyCardRow';
import styles from './StepConfirmAllInput.css';

interface FormValues {
  colonyName: string;
  displayName: string;
  tokenAddress?: string;
  tokenChoice: 'create' | 'select';
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  username: string;
}

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  title: {
    id: 'CreateColony.StepConfirmAllInput.title',
    defaultMessage: `Does this look right?`,
  },
  subtitle: {
    id: 'CreateColony.StepConfirmAllInput.subtitle',
    defaultMessage: `Please double check that these details
      are correct, they cannot be changed later.`,
  },
  continue: {
    id: 'CreateColony.StepConfirmAllInput.continue',
    defaultMessage: `Continue`,
  },
  userName: {
    id: 'CreateColony.StepConfirmAllInput.userName',
    defaultMessage: `Your username`,
  },
  colonyName: {
    id: 'CreateColony.StepConfirmAllInput.colonyName',
    defaultMessage: `Your colony`,
  },
  tokenName: {
    id: 'CreateColony.StepConfirmAllInput.tokenName',
    defaultMessage: `Your colony's native token`,
  },
});

const options: Row[] = [
  {
    title: MSG.userName,
    valueKey: 'username',
  },
  {
    title: MSG.colonyName,
    valueKey: 'colonyName',
  },
  {
    title: MSG.tokenName,
    valueKey: ['tokenSymbol', 'tokenName'],
  },
];

const StepConfirmAllInput = ({
  nextStep,
  wizardValues: {
    colonyName,
    displayName,
    tokenAddress,
    tokenChoice,
    tokenIcon,
    tokenName,
    tokenSymbol,
    username,
  },
  wizardValues,
}: Props) => {
  const transform = useCallback(
    mergePayload({
      colonyName,
      displayName,
      tokenAddress,
      tokenChoice,
      tokenIcon,
      tokenName,
      tokenSymbol,
      username,
    }),
    [username, displayName, colonyName, tokenName, tokenIcon, tokenSymbol],
  );
  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_CREATE}
      success={ActionTypes.COLONY_CREATE_SUCCESS}
      error={ActionTypes.COLONY_CREATE_ERROR}
      transform={transform}
      onSuccess={() => nextStep(wizardValues)}
    >
      {({ isSubmitting, status }) => (
        <section className={styles.main}>
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.title}
          />
          <p className={styles.paragraph}>
            <FormattedMessage {...MSG.subtitle} />
          </p>
          <div className={styles.finalContainer}>
            <CardRow cardOptions={options} values={wizardValues} />
          </div>
          <FormStatus status={status} />
          <div className={styles.buttons}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              type="submit"
              text={MSG.continue}
              loading={isSubmitting}
            />
          </div>
        </section>
      )}
    </ActionForm>
  );
};

StepConfirmAllInput.displayName =
  'dashboard.CreateColonyWizard.StepConfirmAllInput';

export default StepConfirmAllInput;
