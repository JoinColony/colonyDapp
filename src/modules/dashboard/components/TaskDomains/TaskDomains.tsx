import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';
import { DomainType, TaskProps } from '~immutable/index';
import { ActionTypes } from '~redux/actionTypes';
import { log } from '~utils/debug';
import { useAsyncFunction, useDataFetcher, useSelector } from '~utils/hooks';
import { bnLessThan } from '~utils/numbers';

import { domainsFetcher } from '../../fetchers';
import { colonyTokensSelector, taskPayoutsSelector } from '../../selectors';

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

interface Props extends TaskProps<'colonyAddress' | 'domainId' | 'draftId'> {
  disabled?: boolean;
}

// This odd typing makes DomainType compatible with ConsumableItem
interface ConsumableDomainType extends Omit<DomainType, 'id'> {
  id: number;
  children?: any;
  parent?: any;
}
type ConsumableDomainArray = ConsumableDomainType[];

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({ colonyAddress, domainId, draftId, disabled }: Props) => {
  const setDomain = useAsyncFunction({
    submit: ActionTypes.TASK_SET_DOMAIN,
    success: ActionTypes.TASK_SET_DOMAIN_SUCCESS,
    error: ActionTypes.TASK_SET_DOMAIN_ERROR,
  });

  const [selectedDomainId, setSelectedDomainId] = useState<number | undefined>(
    domainId,
  );

  const handleSetDomain = useCallback(
    async (domainValue: any) => {
      try {
        await setDomain({
          colonyAddress,
          domainId: domainValue.id,
          draftId,
        });
        setSelectedDomainId(domainValue.id);
      } catch (caughtError) {
        log.error(caughtError);
      }
    },
    [colonyAddress, draftId, setDomain],
  );

  const { data: domains } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const payouts = useSelector(taskPayoutsSelector, [draftId]);
  const tokens = useSelector(colonyTokensSelector, [colonyAddress]);

  const domainHasEnoughFunds = useCallback(
    (id: string) =>
      payouts.every(({ amount, token }) => {
        const payoutToken = tokens.find(({ address }) => address === token);
        const tokenBalanceInDomain =
          payoutToken && payoutToken.balances && payoutToken.balances[id];
        return !bnLessThan(tokenBalanceInDomain, amount);
      }),
    [payouts, tokens],
  );

  const consumableDomains: ConsumableDomainArray = useMemo(
    () =>
      Object.keys(domains || {})
        .sort()
        .map(id => ({
          ...(domains || {})[id],
          disabled: !domainHasEnoughFunds(id),
          disabledText: !domainHasEnoughFunds(id)
            ? MSG.insufficientFundsInDomain
            : undefined,
          id: parseInt(id, 10),
        })),
    [domainHasEnoughFunds, domains],
  );

  return (
    <div className={styles.main}>
      <ItemsList
        list={consumableDomains}
        handleSetItem={handleSetDomain}
        name="taskDomains"
        connect={false}
        showArrow={false}
        itemId={domainId || COLONY_TOTAL_BALANCE_DOMAIN_ID}
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
              textValues={{ domainSelected: selectedDomainId }}
            />
          )}
        </div>
      </ItemsList>
      {!domainId && (
        <span className={styles.notSet}>
          <FormattedMessage {...MSG.notSet} />
        </span>
      )}
    </div>
  );
};

TaskDomains.displayName = displayName;

export default TaskDomains;
