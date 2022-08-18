import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { FormSection } from '~core/Fields';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Colony } from '~data/index';

import PreviewDialog from '../PreviewDialog';
import { Batch } from '../types';

import styles from './LockedBatch.css';

export const MSG = defineMessages({
  batch: {
    id: 'dashboard.ExpenditurePage.Batch.LockedBatch.batch.',
    defaultMessage: 'Batch',
  },
  viewAll: {
    id: `dashboard.ExpenditurePage.Batch.LockedBatch.viewAll`,
    defaultMessage: 'View all',
  },
  recipients: {
    id: 'dashboard.ExpenditurePage.Batch.LockedBatch.recipients',
    defaultMessage: 'Recipients',
  },
  value: {
    id: 'dashboard.ExpenditurePage.Batch.LockedBatch.value',
    defaultMessage: 'Value',
  },
  valueWithToken: {
    id: 'dashboard.ExpenditurePage.Batch.LockedBatch.valueWithToken',
    defaultMessage: '{icon} {token} {amount}',
  },
  data: {
    id: 'dashboard.ExpenditurePage.Batch.LockedBatch.data.',
    defaultMessage: 'Data',
  },
});

const displayName = 'dashboard.ExpenditurePage.Batch.LockedBatch';

interface Props {
  colony: Colony;
  batch: Batch;
}

const LockedBatch = ({ colony, batch }: Props) => {
  const { formatMessage } = useIntl();
  const openPreviewDialog = useDialog(PreviewDialog);

  return (
    <div className={styles.batchContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <FormattedMessage {...MSG.batch} />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.data}>
          <FormattedMessage {...MSG.data} />
          <Button
            type="button"
            onClick={() =>
              batch.data && openPreviewDialog({ values: batch.data, colony })
            }
            appearance={{ theme: 'blue' }}
            text={MSG.viewAll}
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.dataRow}>
          <FormattedMessage {...MSG.recipients} />
          <div className={styles.value}>{batch.recipients}</div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div
          className={classNames(styles.valueRow, {
            [styles.valueContainer]:
              batch.tokens?.length && batch.tokens.length > 1,
          })}
        >
          <FormattedMessage {...MSG.value} />
          <div className={styles.tokenWrapper}>
            {batch.tokens?.map((tokenItem, index) => {
              const { token, amount } = tokenItem || {};

              return (
                token &&
                amount && (
                  <div
                    className={classNames(styles.value, {
                      [styles.marginBottom]:
                        batch.tokens &&
                        batch.tokens.length > 1 &&
                        index + 1 !== batch.tokens.length,
                    })}
                    key={token.id}
                  >
                    {formatMessage(MSG.valueWithToken, {
                      token: token.symbol,
                      amount:
                        typeof amount === 'number' ? amount.toString() : '',
                      icon: (
                        <span className={styles.icon}>
                          <TokenIcon
                            className={styles.tokenIcon}
                            token={token}
                            name={token.name || token.address}
                          />
                        </span>
                      ),
                    })}
                  </div>
                )
              );
            })}
          </div>
        </div>
      </FormSection>
    </div>
  );
};

LockedBatch.displayName = displayName;

export default LockedBatch;
