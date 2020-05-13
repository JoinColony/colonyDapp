import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import { Form } from '~core/Fields';
import Heading from '~core/Heading';
import ItemsList from '~core/ItemsList';
import { useSetTaskDomainMutation, AnyTask, Payouts } from '~data/index';
import { DomainType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataFetcher } from '~utils/hooks';

import { domainsFetcher } from '../../fetchers';

import styles from './TaskDomains.css';

const MSG = defineMessages({
  insufficientFundsInDomain: {
    id: 'dashboard.TaskDomains.insufficientFundsInDomain',
    defaultMessage: 'This domain has insufficient funds.',
  },
  notSet: {
    id: 'dashboard.TaskDomains.notSet',
    defaultMessage: 'Domain not set',
  },
  title: {
    id: 'dashboard.TaskDomains.title',
    defaultMessage: 'Domain',
  },
  selectDomain: {
    id: 'dashboard.TaskDomains.selectDomain',
    defaultMessage: `{domainSelected, select,
      undefined {Add +}
      other {Modify}
    }`,
  },
});

interface FormValues {
  taskDomains: number;
}

interface Props {
  colonyAddress: Address;
  disabled?: boolean;
  draftId: AnyTask['id'];
  ethDomainId: number;
  payouts: Payouts;
}

// This odd typing makes DomainType compatible with ConsumableItem
interface ConsumableDomainType extends Omit<DomainType, 'id'> {
  id: number;
  children?: any;
  parent?: any;
}
type ConsumableDomainArray = ConsumableDomainType[];

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({
  colonyAddress,
  ethDomainId,
  draftId,
  disabled,
}: Props) => {
  const [setDomain] = useSetTaskDomainMutation();

  const handleSetDomain = useCallback(
    ({ taskDomains }: FormValues) => {
      setDomain({
        variables: {
          input: {
            ethDomainId: taskDomains,
            id: draftId,
          },
        },
      });
    },
    [draftId, setDomain],
  );

  const { data: domains } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const consumableDomains: ConsumableDomainArray = useMemo(
    () =>
      Object.keys(domains || {})
        .sort()
        .map((id) => ({
          ...(domains || {})[id],
          disabled: false,
          /* disabled: !domainHasEnoughFunds(parseInt(id, 10)), */
          id: parseInt(id, 10),
        }))
        /**
         * @NOTE Temporary patch
         *
         * This will return just the selected domain from the consumables array
         * This is needed since the items list will sort the array and such will
         * always return ROOT as the first domain, which will be "selected" on the task
         *
         * This is a visual change only, to display the "correct" domain, but one
         * that will need to be removed once we bring back the feature to be able
         * to select domains after a task's creation.
         */
        .filter(({ id }) => id === ethDomainId),
    [domains, ethDomainId],
  );

  return (
    <div className={styles.main}>
      <Form
        initialValues={{
          taskDomains: ethDomainId || COLONY_TOTAL_BALANCE_DOMAIN_ID,
        }}
        onSubmit={handleSetDomain}
      >
        {({ submitForm, values: { taskDomains } }) => (
          <>
            <ItemsList
              list={consumableDomains}
              name="taskDomains"
              showArrow={false}
              onChange={submitForm}
              disabled={disabled}
            >
              <div className={styles.controls}>
                <Heading
                  appearance={{ size: 'small', margin: 'none' }}
                  text={MSG.title}
                />
                {!disabled && (
                  <Button
                    appearance={{ theme: 'blue', size: 'small' }}
                    text={MSG.selectDomain}
                    textValues={{ domainSelected: taskDomains }}
                  />
                )}
              </div>
            </ItemsList>
            {!ethDomainId && (
              <span className={styles.notSet}>
                <FormattedMessage {...MSG.notSet} />
              </span>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

TaskDomains.displayName = displayName;

export default TaskDomains;
