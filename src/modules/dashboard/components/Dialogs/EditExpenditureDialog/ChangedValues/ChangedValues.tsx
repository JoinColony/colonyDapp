import React, { Fragment, useCallback } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { FormSection } from '~core/Fields';
import Button from '~core/Button';
import { Colony } from '~data/index';
import ColorTag, { Color } from '~core/ColorTag';
import Icon from '~core/Icon';
import { ValuesType } from '~pages/ExpenditurePage/types';

import NewValue from '../NewValue';

import styles from './ChangedValues.css';

export const MSG = defineMessages({
  change: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.change',
    defaultMessage: 'Change {name}',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.discard',
    defaultMessage: 'Discard',
  },
  teamCaption: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.teamCaption',
    defaultMessage: 'Team',
  },
  none: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.none',
    defaultMessage: 'None',
  },
  from: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.to',
    defaultMessage: 'To',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedValues';

export type ValueOf<T> = T[keyof T];
interface Props {
  newValues?: {
    key: string;
    value?: ValueOf<ValuesType>;
    id: string;
  }[];
  oldValues: ValuesType;
  colony: Colony;
  discardChange: (name: string) => void;
}

const ChangedValues = ({
  newValues,
  colony,
  discardChange,
  oldValues,
}: Props) => {
  const { formatMessage } = useIntl();

  const renderChange = useCallback(
    (change: any, key: string) => {
      switch (key) {
        case 'title': {
          return change || formatMessage(MSG.none);
        }
        case 'description': {
          return change || formatMessage(MSG.none);
        }
        case 'filteredDomainId': {
          const domain = colony?.domains.find(
            ({ ethDomainId }) => Number(change) === ethDomainId,
          );
          const defaultColor =
            change === String(ROOT_DOMAIN_ID) ? Color.LightPink : Color.Yellow;

          const color = domain ? domain.color : defaultColor;
          return (
            <div className={styles.teamWrapper}>
              <ColorTag color={color} />
              {domain?.name}
            </div>
          );
        }
        case 'amount': {
          return <NewValue colony={colony} newValue={change} />;
        }
        default:
          return null;
      }
    },
    [colony, formatMessage],
  );

  if (!newValues) {
    return null;
  }

  return (
    <>
      {newValues.map(({ key, value, id }) => {
        const oldValue = oldValues[key];
        return (
          <Fragment key={id}>
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.changeContainer}>
                <FormattedMessage
                  {...MSG.change}
                  values={{
                    name:
                      key === 'filteredDomainId' ? (
                        <FormattedMessage {...MSG.teamCaption} />
                      ) : (
                        key
                      ),
                  }}
                />
              </div>
              <div className={styles.subheader}>
                <span>
                  <FormattedMessage {...MSG.from} />
                </span>
                <span>
                  <FormattedMessage {...MSG.to} />
                </span>
              </div>
            </FormSection>
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.row}>
                <div className={styles.left}>{renderChange(oldValue, key)}</div>
                <Icon name="arrow-right" className={styles.arrowIcon} />
                <div className={styles.right}>{renderChange(value, key)}</div>
              </div>
            </FormSection>
            <div className={styles.buttonWrappper}>
              <Button
                className={styles.discard}
                onClick={() => {
                  discardChange(key);
                }}
                text={MSG.discard}
              />
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

ChangedValues.displayName = displayName;

export default ChangedValues;
