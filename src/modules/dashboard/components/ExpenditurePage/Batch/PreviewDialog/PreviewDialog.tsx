import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Dialog, { DialogSection } from '~core/Dialog';
import MaskedAddress from '~core/MaskedAddress';

import { BatchDataItem } from '../types';

import styles from './PreviewDialog.css';

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
});

interface Props {
  cancel: () => void;
  values: BatchDataItem[];
}

const PreviewDialog = ({ cancel, values }: Props) => {
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
          {values?.map(({ Recipient, Token, Value }, index) => (
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div
                className={classNames(styles.row, {
                  [styles.borderTop]: index === 0,
                  [styles.lastRow]: index === values.length - 1,
                })}
              >
                <div className={styles.left}>
                  <MaskedAddress address={Recipient} />
                </div>
                <div className={styles.middle}>{Token}</div>
                <div className={styles.right}>{Value}</div>
              </div>
            </DialogSection>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

PreviewDialog.displayName = displayName;

export default PreviewDialog;
