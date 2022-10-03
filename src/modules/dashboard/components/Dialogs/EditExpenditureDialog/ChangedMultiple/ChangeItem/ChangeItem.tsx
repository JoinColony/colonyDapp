import { nanoid } from 'nanoid';
import React, { useCallback } from 'react';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { ValueOf } from '../../ChangedValues/ChangedValues';

import NewDelay from '../../NewDelay';
import NewRecipient from '../../NewRecipient';
import NewValue from '../../NewValue';

import styles from './ChangeItem.css';

const displayName =
  'dashboard.EditExpenditureDialog.ChangedMultiple.ChangeItem';

interface Props {
  newValue: ValueOf<ValuesType>;
  oldValue?: ValueOf<ValuesType>;
  name: string;
  colony: Colony;
}

const ChangeItem = ({ newValue, oldValue, name, colony }: Props) => {
  const renderChange = useCallback(
    (change) => {
      switch (name) {
        case 'recipient': {
          return <NewRecipient newValue={change} key={nanoid()} />;
        }
        case 'user': {
          return <NewRecipient newValue={change} key={nanoid()} />;
        }
        case 'value': {
          return <NewValue colony={colony} newValue={change} key={nanoid()} />;
        }
        case 'amount': {
          return <NewValue colony={colony} newValue={change} key={nanoid()} />;
        }
        case 'delay': {
          return <NewDelay newValue={change} key={nanoid()} />;
        }
        default:
          return null;
      }
    },
    [colony, name],
  );

  return (
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.row}>
        <div className={styles.left}>{renderChange(oldValue)}</div>
        <Icon name="arrow-right" className={styles.arrowIcon} />
        <div className={styles.right}>{renderChange(newValue)}</div>
      </div>
    </FormSection>
  );
};

ChangeItem.displayName = displayName;

export default ChangeItem;
