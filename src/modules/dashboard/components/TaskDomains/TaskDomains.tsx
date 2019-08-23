import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  IntlShape,
} from 'react-intl';
import React, { useCallback, useMemo, useState } from 'react';

import { DomainType, TaskProps } from '~immutable/index';
import { ActionTypes } from '~redux/actionTypes';
import { useAsyncFunction, useDataFetcher } from '~utils/hooks';
import { log } from '~utils/debug';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';
import { domainsFetcher } from '../../fetchers';
import styles from './TaskDomains.css';

const MSG = defineMessages({
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
  rootDomain: {
    id: 'dashboard.TaskDomains.rootDomain',
    defaultMessage: 'root',
  },
});

interface Props extends TaskProps<'colonyAddress' | 'domainId' | 'draftId'> {
  disabled?: boolean;
  intl: IntlShape;
}

// This odd typing makes DomainType compatible with ConsumableItem
interface ConsumableDomainType extends DomainType {
  children?: any;
  parent?: any;
}
type ConsumableDomainArray = ConsumableDomainType[];

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({
  colonyAddress,
  domainId,
  draftId,
  disabled,
  intl: { formatMessage },
}: Props) => {
  const setDomain = useAsyncFunction({
    submit: ActionTypes.TASK_SET_DOMAIN,
    success: ActionTypes.TASK_SET_DOMAIN_SUCCESS,
    error: ActionTypes.TASK_SET_DOMAIN_ERROR,
  });

  const [selectedDomainId, setSelectedDomainId] = useState(domainId);

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

  const { data: domains } = useDataFetcher<ConsumableDomainArray>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
    // eslint-disable-next-line prettier/prettier
  );

  const domainsWithRoot = useMemo(
    () =>
      domains && [{ id: 1, name: formatMessage(MSG.rootDomain) }, ...domains],
    [domains, formatMessage],
  );

  return (
    <div className={styles.main}>
      <ItemsList
        list={domainsWithRoot || []}
        handleSetItem={handleSetDomain}
        name="taskDomains"
        connect={false}
        showArrow={false}
        itemId={domainId}
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

export default injectIntl(TaskDomains);
