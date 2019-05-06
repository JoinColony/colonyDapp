/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';

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

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyAddress: *, domainId: *, draftId: * }>,
|};

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({
  colonyAddress,
  domainId,
  draftId,
  isTaskCreator,
}: Props) => {
  const setDomain = useAsyncFunction({
    submit: ACTIONS.TASK_SET_DOMAIN,
    success: ACTIONS.TASK_SET_DOMAIN_SUCCESS,
    error: ACTIONS.TASK_SET_DOMAIN_ERROR,
  });

  const [selectedDomainId, setSelectedDomainId] = useState();

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

  return (
    <div className={styles.main}>
      {isTaskCreator && (
        <ItemsList
          list={domains || []}
          itemDisplayPrefix="#"
          handleSetItem={handleSetDomain}
          name="taskDomains"
          connect={false}
          showArrow={false}
          itemId={domainId}
        >
          <div className={styles.controls}>
            <Heading
              appearance={{ size: 'small', margin: 'none' }}
              text={MSG.title}
            />
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={MSG.selectDomain}
              textValues={{ domainSelected: selectedDomainId }}
            />
          </div>
        </ItemsList>
      )}
    </div>
  );
};

TaskDomains.displayName = displayName;

export default TaskDomains;
