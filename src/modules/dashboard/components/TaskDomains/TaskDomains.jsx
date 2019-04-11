/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { useAsyncFunction } from '~utils/hooks';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';

import styles from './TaskDomains.css';

import mockDomains from '../../../../__mocks__/mockDomains';

import ACTIONS from '~redux/actions';

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
  ...TaskProps<{ colonyName: *, domainId: *, draftId: * }>,
|};

const displayName = 'dashboard.TaskDomains';

const TaskDomains = ({
  colonyName,
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
          colonyName,
          domainId: domainValue.id,
          draftId,
        });
        setSelectedDomainId(domainValue.id);
      } catch (error) {
        console.error(error);
      }
    },
    [colonyName, draftId, setDomain],
  );

  const list = Array(...mockDomains);
  return (
    <div className={styles.main}>
      {isTaskCreator && (
        <ItemsList
          list={list}
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
