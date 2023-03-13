import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import Icon from '~core/Icon';
import { SignOption } from '~dashboard/Incorporation/IncorporationForm/constants';
import { ValuesType } from '~pages/IncorporationPage/types';
import { multiLineTextEllipsis } from '~utils/strings';

import NewRecipient from '../NewRecipient';

import styles from './ChangedValues.css';

export const MSG = defineMessages({
  none: {
    id: 'dashboard.EditIncorporationDialog.ChangedValues.none',
    defaultMessage: 'None',
  },
  individual: {
    id: 'dashboard.EditIncorporationDialog.ChangedValues.individual',
    defaultMessage: 'Individual signing',
  },
  multiple: {
    id: 'dashboard.EditIncorporationDialog.ChangedValues.multiple',
    defaultMessage: 'All have to sign',
  },
});

const displayName = 'dashboard.EditIncorporationDialog.ChangedValues';

export type ValueOf<T> = T[keyof T];
interface Props {
  newValues?: {
    key: string;
    value?: ValueOf<ValuesType>;
    id: string;
  }[];
  oldValues: ValuesType;
}

const ChangedValues = ({ newValues, oldValues }: Props) => {
  const { formatMessage } = useIntl();

  const renderChange = useCallback(
    (change: any, key: string, newVallue: boolean) => {
      switch (key) {
        case 'name':
        case 'alternativeName1':
        case 'alternativeName2':
        case 'purpose': {
          return (
            multiLineTextEllipsis(change, newVallue ? 40 : 20) ||
            formatMessage(MSG.none)
          );
        }
        case 'protectors': {
          return <NewRecipient newValue={change} />;
        }
        case 'mainContact': {
          return <NewRecipient newValue={change} />;
        }
        case 'signOption': {
          return change === SignOption.Individual ? (
            <FormattedMessage {...MSG.individual} />
          ) : (
            <FormattedMessage {...MSG.multiple} />
          );
        }
        default:
          return null;
      }
    },
    [formatMessage],
  );

  if (!newValues || isEmpty(newValues)) {
    return null;
  }

  return (
    <>
      {newValues.map(({ key, value }) => {
        const oldValue = oldValues[key];

        return (
          <div
            className={classNames(styles.row, {
              [styles.smallerPadding]: key === 'mainContact,',
            })}
          >
            <div className={styles.left}>
              {renderChange(oldValue, key, false)}
            </div>
            <Icon name="arrow-right" className={styles.arrowIcon} />
            <div className={styles.right}>{renderChange(value, key, true)}</div>
          </div>
        );
      })}
    </>
  );
};

ChangedValues.displayName = displayName;

export default ChangedValues;
