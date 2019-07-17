/* @flow */

import type { IntlShape } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import type { DomainType, TaskProps } from '~immutable';

import ACTIONS from '~redux/actions';
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
    defaultMessage: 'Root',
  },
});

type Props = {|
  disabled?: boolean,
  intl: IntlShape,
  ...TaskProps<{ colonyAddress: *, domainId: *, draftId: * }>,
|};

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({
  colonyAddress,
  domainId,
  draftId,
  disabled,
  intl: { formatMessage },
}: Props) => {
  const setDomain = useAsyncFunction({
    submit: ACTIONS.TASK_SET_DOMAIN,
    success: ACTIONS.TASK_SET_DOMAIN_SUCCESS,
    error: ACTIONS.TASK_SET_DOMAIN_ERROR,
  });

  const [selectedDomainId, setSelectedDomainId] = useState(domainId);

  const handleSetDomain = useCallback(
    async (domainValue: Object) => {
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

  const { data: domains } = useDataFetcher<
    // This odd typing makes DomainType compatible with ConsumableItem
    { children?: *, parent?: *, ...DomainType }[],
  >(domainsFetcher, [colonyAddress], [colonyAddress]);

  const domainsWithRoot = useMemo(
    () =>
      domains && [{ id: 1, name: formatMessage(MSG.rootDomain) }, ...domains],
    [domains, formatMessage],
  );

  return (
    <div className={styles.main}>
      <ItemsList
        list={domainsWithRoot || []}
        itemDisplayPrefix="#"
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
