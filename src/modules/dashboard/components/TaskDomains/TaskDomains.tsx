import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import { Form } from '~core/Fields';
import Heading from '~core/Heading';
import ItemsList from '~core/ItemsList';
import {
  useColonyDomainsQuery,
  useSetTaskDomainMutation,
  AnyTask,
  Payouts,
} from '~data/index';
import { Address } from '~types/index';

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

  const { data } = useColonyDomainsQuery({ variables: { colonyAddress } });

  const domainList = useMemo(
    () =>
      data && data.colony
        ? data.colony.domains.map(({ ethDomainId: id, name }) => ({
            id,
            name,
            disabled: false,
          }))
        : [],
    [data],
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
              list={domainList}
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
