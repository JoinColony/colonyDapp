import React, { Fragment, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { FormSection } from '~core/Fields';
import { Recipient as RecipientType } from '~dashboard/ExpenditurePage/Payments/types';
import { LoggedInUser } from '~data/generated';
import Button from '~core/Button';
import { Colony } from '~data/index';
import ColorTag, { Color } from '~core/ColorTag';

import styles from './ChangedValues.css';

export const MSG = defineMessages({
  change: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.change',
    defaultMessage: 'Change',
  },
  new: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.new',
    defaultMessage: 'New',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.discard',
    defaultMessage: 'Discard',
  },
  teamCaption: {
    id: 'dashboard.EditExpenditureDialog.ChangedValues.teamCaption',
    defaultMessage: 'Team',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedValues';

interface Props {
  newValues?: {
    key: string;
    value:
      | string
      | Pick<
          LoggedInUser,
          'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'
        >
      | RecipientType[];
    id: string;
  }[];
  colony: Colony;
  discardChange: (name: string) => void;
}

const ChangedValues = ({ newValues, colony, discardChange }: Props) => {
  const renderChange = useCallback(
    (change: any, key: string) => {
      switch (key) {
        case 'title': {
          return change || '-';
        }
        case 'description': {
          return change || '-';
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
        default:
          return null;
      }
    },
    [colony],
  );

  if (!newValues) {
    return null;
  }

  return (
    <>
      {newValues.map(({ key, value, id }) => {
        return (
          <Fragment key={id}>
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.changeContainer}>
                <span>
                  <FormattedMessage {...MSG.change} />{' '}
                  {key === 'filteredDomainId' ? (
                    <FormattedMessage {...MSG.teamCaption} />
                  ) : (
                    key
                  )}
                </span>
                <Button
                  appearance={{ theme: 'dangerLink' }}
                  onClick={() => discardChange(key)}
                >
                  <FormattedMessage {...MSG.discard} />
                </Button>
              </div>
            </FormSection>
            <FormSection appearance={{ border: 'bottom' }}>
              <div
                className={classNames(
                  styles.changeContainer,
                  styles.changeItem,
                )}
              >
                <span>
                  <FormattedMessage {...MSG.new} />{' '}
                  {key === 'filteredDomainId' ? (
                    <FormattedMessage {...MSG.teamCaption} />
                  ) : (
                    key
                  )}
                </span>
                <span className={styles.changeWrapper}>
                  {renderChange(value, key)}
                </span>
              </div>
            </FormSection>
          </Fragment>
        );
      })}
    </>
  );
};

ChangedValues.displayName = displayName;

export default ChangedValues;
