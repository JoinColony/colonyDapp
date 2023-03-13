import React, { Fragment, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/IncorporationPage/types';

import NewRecipient from '../NewRecipient';
import { NewValueType } from '../types';

import styles from './ChangedMultipleUsers.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditIncorporationDialog.ChangedMultipleUsers.discard',
    defaultMessage: 'Discard',
  },
  changeRecipient: {
    id: `dashboard.EditIncorporationDialog.ChangedMultipleUsers.changeRecipient`,
    defaultMessage: 'Change Recipient',
  },
  removed: {
    id: `dashboard.EditIncorporationDialog.ChangedMultipleUsers.removed`,
    defaultMessage: 'Removed protector',
  },
  added: {
    id: `dashboard.EditIncorporationDialog.ChangedMultipleUsers.added`,
    defaultMessage: 'Added protector',
  },
});

const displayName = 'dashboard.EditIncorporationDialog.ChangedMultipleUsers';

interface Props {
  newValues?: NewValueType[];
  colony: Colony;
  oldValues: ValuesType;
}

const ChangedMultipleUsers = ({ newValues, oldValues }: Props) => {
  const renderUserChange = useCallback((newUser, oldUser) => {
    if (newUser.removed) {
      return (
        <div className={styles.row}>
          <FormattedMessage {...MSG.removed} />
          <Icon name="arrow-right" className={styles.arrowIcon} />
          <span className={styles.right}>
            <NewRecipient newValue={oldUser.user} />
          </span>
        </div>
      );
    }

    if (newUser.created) {
      return (
        <div className={styles.row}>
          <FormattedMessage {...MSG.added} />
          <Icon name="arrow-right" className={styles.arrowIcon} />
          <span className={styles.right}>
            <NewRecipient newValue={newUser.user} />
          </span>
        </div>
      );
    }

    return (
      <div className={styles.row}>
        <div className={styles.left}>
          <NewRecipient newValue={oldUser.user} />
        </div>
        <Icon name="arrow-right" className={styles.arrowIcon} />
        <div className={styles.right}>
          <NewRecipient newValue={newUser.user} />
        </div>
      </div>
    );
  }, []);

  if (!Array.isArray(newValues) || !Array.isArray) {
    return null;
  }

  return (
    <>
      {newValues?.map((newValue) => (
        <Fragment key={newValue.key}>
          {Array.isArray(newValue.value) &&
            newValue.value?.map((changeItem) => {
              const oldItem = oldValues[newValue.key]?.find(
                (item) => item?.key === changeItem?.key,
              );
              return (
                <Fragment key={changeItem.key}>
                  {renderUserChange(changeItem, oldItem)}
                </Fragment>
              );
            })}
        </Fragment>
      ))}
    </>
  );
};

ChangedMultipleUsers.displayName = displayName;

export default ChangedMultipleUsers;
