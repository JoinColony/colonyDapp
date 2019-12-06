import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import React, { useCallback, useMemo, useState } from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';
import { useSetTaskDomainMutation } from '~data/index';
import { DomainType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { bnLessThan } from '~utils/numbers';

import { domainsFetcher } from '../../fetchers';
import { colonyTokensSelector } from '../../selectors';

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

interface Props {
  colonyAddress: Address;
  disabled?: boolean;
  draftId: string;
  ethDomainId: number;
}

// This odd typing makes DomainType compatible with ConsumableItem
interface ConsumableDomainType extends Omit<DomainType, 'id'> {
  id: number;
  children?: any;
  parent?: any;
}
type ConsumableDomainArray = ConsumableDomainType[];

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({ colonyAddress, ethDomainId, draftId, disabled }: Props) => {
  const [setDomain] = useSetTaskDomainMutation();

  const [selectedDomainId, setSelectedDomainId] = useState<number | undefined>(
    ethDomainId,
  );

  const handleSetDomain = useCallback(
    (domainValue: number) => {
      setDomain({
        variables: {
          input: {
            ethDomainId: domainValue,
            id: draftId,
          }
        }
      });
      setSelectedDomainId(domainValue);
    },
    [colonyAddress, draftId, setDomain],
  );

  const { data: domains } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  // @todo get centralized payouts
  const payouts = [];
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
        itemId={ethDomainId || COLONY_TOTAL_BALANCE_DOMAIN_ID}
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
      {!ethDomainId && (
        <span className={styles.notSet}>
          <FormattedMessage {...MSG.notSet} />
        </span>
      )}
    </div>
  );
};

TaskDomains.displayName = displayName;

export default injectIntl(TaskDomains);
