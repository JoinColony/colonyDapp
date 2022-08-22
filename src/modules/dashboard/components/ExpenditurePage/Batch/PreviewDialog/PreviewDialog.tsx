import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';

import Dialog, { DialogSection } from '~core/Dialog';
import MaskedAddress from '~core/MaskedAddress';

import { BatchDataItem } from '../types';

import styles from './PreviewDialog.css';
import { AnyToken } from '~data/index';

const displayName = 'dashboard.ExpenditurePage.Batch.PreviewDialog';

export const MSG = defineMessages({
  batch: {
    id: 'dashboard.ExpenditurePage.Batch.PreviewDialog.batch',
    defaultMessage: 'Batch payment preview',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.Batch.PreviewDialog.recipient',
    defaultMessage: 'Recipient',
  },
  token: {
    id: 'dashboard.ExpenditurePage.Batch.PreviewDialog.token',
    defaultMessage: 'Token',
  },
  amount: {
    id: 'dashboard.ExpenditurePage.Batch.PreviewDialog.amount',
    defaultMessage: 'Amount',
  },
  tokenNotFound: {
    id: 'dashboard.ExpenditurePage.Batch.PreviewDialog.tokenNotFound',
    defaultMessage: 'Token not found',
  },
});

interface ValidatedBatchDataItem extends Omit<BatchDataItem, 'token'> {
  error?: boolean;
  token?: AnyToken;
  id: string;
}

interface Props {
  cancel: () => void;
  values?: ValidatedBatchDataItem[];
}

const PreviewDialog = ({ cancel, values }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog cancel={cancel}>
      <div className={styles.wrapper}>
        <DialogSection>
          <div className={styles.header}>
            <FormattedMessage {...MSG.batch} />
          </div>
        </DialogSection>
        <div>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.tableHeader}>
              <div className={styles.left}>
                <FormattedMessage {...MSG.recipient} />
              </div>
              <div className={styles.middle}>
                <FormattedMessage {...MSG.token} />
              </div>
              <div className={styles.right}>
                <FormattedMessage {...MSG.amount} />
              </div>
            </div>
          </DialogSection>
          {values?.map(({ recipient, token, amount, id, error }, index) => {
            return (
              <DialogSection appearance={{ theme: 'sidePadding' }} key={id}>
                <div
                  className={classNames(styles.row, {
                    [styles.borderTop]: index === 0,
                    [styles.error]: error,
                  })}
                >
                  <div
                    className={classNames(styles.left, {
                      [styles.validUser]: !error,
                    })}
                  >
                    <MaskedAddress address={recipient || ''} />
                  </div>
                  <div className={styles.middle}>
                    {token?.symbol || formatMessage(MSG.tokenNotFound)}
                  </div>
                  <div className={styles.right}>{amount}</div>
                </div>
              </DialogSection>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};

PreviewDialog.displayName = displayName;

export default PreviewDialog;
