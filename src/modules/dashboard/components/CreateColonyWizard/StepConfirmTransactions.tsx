import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'redux-react-hook';

import { WizardProps } from '~core/Wizard';
import Heading from '~core/Heading';
import NavLink from '~core/NavLink';
import { useSelector } from '~utils/hooks';
import { log } from '~utils/debug';
import ENS from '~lib/ENS';

import GasStationContent from '../../../users/components/GasStation/GasStationContent';
import { groupedTransactions } from '../../../core/selectors';
import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
  findNewestGroup,
} from '../../../users/components/GasStation/transactionGroup';
import { TRANSACTION_STATUSES } from '~immutable/Transaction';
import { ActionTypes } from '~redux/index';

import styles from './StepConfirmTransactions.css';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.heading',
    defaultMessage: `Complete these transactions to deploy
      your colony to the blockchain.`,
  },
  deploymentFailed: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.deploymentFailed',
    defaultMessage: `An error occurred. Click {linkToColony} to go to your colony and continue`,
  },
  keywordHere: {
    id: 'dashboard.CreateColonyWizard.StepConfirmTransactions.keywordHere',
    defaultMessage: `here`,
  },
});

interface FormValues {
  colonyName: string;
}

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepConfirmTransactions';

const StepConfirmTransactions = ({
  wizardValues: { colonyName: chosenColonyName },
}: Props) => {
  const [createErrorButRecoverable, setCreateErrorButRecoverable] = useState<
    boolean
  >(false);
  const dispatch = useDispatch();

  const txGroups = useSelector(groupedTransactions);
  const newestGroup = findNewestGroup(txGroups);

  useEffect(() => {
    /*
     * Find out if the deployment failed, and we can actually recover it
     * Show an error message based on that
     */
    const colonyContractWasDeployed = ((newestGroup as unknown) as Array<{
      methodName: string;
      status: typeof TRANSACTION_STATUSES;
    }>).find(
      ({ methodName = '', status = '' }) =>
        methodName.includes('createColony') &&
        status === TRANSACTION_STATUSES.SUCCEEDED,
    );
    const deploymentHasErrors =
      getGroupStatus(newestGroup) === TRANSACTION_STATUSES.FAILED;
    if (colonyContractWasDeployed && deploymentHasErrors) {
      setCreateErrorButRecoverable(true);
    } else if (createErrorButRecoverable) {
      /*
       * Hide the error if the user pressed the retry button
       */
      setCreateErrorButRecoverable(false);
    }
  }, [newestGroup, createErrorButRecoverable, setCreateErrorButRecoverable]);

  // Cancel the saga when the component unmounts
  useEffect(
    () => () => {
      dispatch({ type: ActionTypes.CREATE_CANCEL });
    },
    [dispatch],
  );

  const normalizedColonyName = ENS.normalizeAsText(chosenColonyName);
  // This should never happen
  if (!normalizedColonyName)
    log.error(
      `The colonyName '${normalizedColonyName}' could not be normalized`,
    );
  const colonyName = normalizedColonyName || chosenColonyName;
  // Redirect to the colony if a successful creteColony tx group is found
  if (
    getGroupStatus(newestGroup) === TRANSACTION_STATUSES.SUCCEEDED &&
    getGroupKey(newestGroup) === 'group.createColony'
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const createColonyTxGroup = findTransactionGroupByKey(
    txGroups,
    'group.createColony',
  );

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ size: 'medium', weight: 'medium' }}
        text={MSG.heading}
      />
      <div className={styles.container}>
        {createColonyTxGroup && (
          <GasStationContent
            appearance={{ interactive: false, required: true }}
            transactionAndMessageGroups={[createColonyTxGroup]}
          />
        )}
      </div>
      {createErrorButRecoverable && (
        <div className={styles.deploymentError}>
          <FormattedMessage
            {...MSG.deploymentFailed}
            values={{
              linkToColony: (
                <NavLink
                  className={styles.linkToColony}
                  to={`/colony/${colonyName}`}
                >
                  <FormattedMessage {...MSG.keywordHere} />
                </NavLink>
              ),
            }}
          />
        </div>
      )}
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
