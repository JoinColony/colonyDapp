import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import BigNumber from 'bn.js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';
import {
  AnyTask,
  FullColonyFragment,
  useSetTaskDomainMutation,
} from '~data/index';
import { DomainType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataFetcher } from '~utils/hooks';
import { bnLessThan } from '~utils/numbers';
import { getBalanceFromToken } from '~utils/tokens';

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

interface Props {
  colonyAddress: Address;
  disabled?: boolean;
  draftId: AnyTask['id'];
  ethDomainId: number;
  tokens: FullColonyFragment['tokens'];
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
  tokens,
}: Props) => {
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
          },
        },
      });
      setSelectedDomainId(domainValue);
    },
    [draftId, setDomain],
  );

  const { data: domains } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  // fixme get centralized payouts
  const payouts = [];

  const domainHasEnoughFunds = useCallback(
    (dId: number) =>
      payouts.every(({ amount, token }) => {
        const payoutToken = tokens.find(({ address }) => address === token);
        const tokenBalanceInDomain = getBalanceFromToken(payoutToken, dId);
        return !bnLessThan(new BigNumber(tokenBalanceInDomain), amount);
      }),
    [payouts, tokens],
  );

  const consumableDomains: ConsumableDomainArray = useMemo(
    () =>
      Object.keys(domains || {})
        .sort()
        .map(id => ({
          ...(domains || {})[id],
          disabled: !domainHasEnoughFunds(parseInt(id, 10)),
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
