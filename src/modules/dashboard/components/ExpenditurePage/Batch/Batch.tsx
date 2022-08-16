import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useField } from 'formik';
import classNames from 'classnames';
import { isEmpty, isNil } from 'lodash';

import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';

import CSVUploader from './CSVUploader';
import PreviewDialog from './PreviewDialog';

import { useCalculateBatchPayment } from './hooks';
import DownloadTemplate from './DownloadTemplate';
import styles from './Batch.css';

export const MSG = defineMessages({
  batch: {
    id: 'dashboard.ExpenditurePage.Batch.batch.',
    defaultMessage: 'Batch',
  },
  data: {
    id: 'dashboard.ExpenditurePage.Batch.data.',
    defaultMessage: 'Data (max. 400)',
  },
  upload: {
    id: 'dashboard.ExpenditurePage.Batch.upload',
    defaultMessage: 'Upload .CSV',
  },
  recipients: {
    id: 'dashboard.ExpenditurePage.Batch.recipients',
    defaultMessage: 'Recipients',
  },
  value: {
    id: 'dashboard.ExpenditurePage.Batch.value',
    defaultMessage: 'Value',
  },
  valueWithToken: {
    id: 'dashboard.ExpenditurePage.Batch.valueWithToken',
    defaultMessage: '{icon} {token} {amount}',
  },
  noTokens: {
    id: 'dashboard.ExpenditurePage.Batch.noTokens',
    defaultMessage: 'No tokens',
  },
  noRecipients: {
    id: 'dashboard.ExpenditurePage.Batch.noRecipients',
    defaultMessage: 'No recipients',
  },
  invalidRows: {
    id: 'dashboard.ExpenditurePage.Batch.invalidRows',
    defaultMessage: 'Not all rows were imported, please review. {button}',
  },
  viewAll: {
    id: `dashboard.ExpenditurePage.Batch.CSVUploader.CSVUploaderItem.viewAll`,
    defaultMessage: 'View all',
  },
});

const displayName = 'dashboard.ExpenditurePage.Batch';

interface Props {
  colony: Colony;
}

const Batch = ({ colony }: Props) => {
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const [, { value: batch }] = useField('batch');
  const batchData = batch?.dataCSVUploader?.[0]?.parsedData;

  const data = useCalculateBatchPayment(colony, batchData);
  const { invalidRows, recipientsCount, tokens, validatedData } = data || {};

  const openPreviewDialog = useDialog(PreviewDialog);

  return (
    <div className={styles.batchContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <FormattedMessage {...MSG.batch} />
          {isNil(validatedData) && <DownloadTemplate />}
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.data}>
          <FormattedMessage {...MSG.data} />
          <div className={styles.dropzone}>
            <CSVUploader
              name="batch.dataCSVUploader"
              processingData={processingCSVData}
              setProcessingData={setProcessingCSVData}
            />
          </div>
          {!isNil(batchData) && (
            <Button
              type="button"
              onClick={() => openPreviewDialog({ values: batchData, colony })}
              appearance={{ theme: 'blue' }}
              text={MSG.viewAll}
            />
          )}
        </div>
      </FormSection>
      {data && (
        <>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.dataRow}>
              <FormattedMessage {...MSG.recipients} />
              {recipientsCount ? (
                <div className={styles.value}>{recipientsCount}</div>
              ) : (
                <div className={styles.empty}>
                  <FormattedMessage {...MSG.noRecipients} />
                </div>
              )}
            </div>
          </FormSection>
          <FormSection appearance={{ border: 'bottom' }}>
            <div
              className={classNames(styles.valueRow, {
                [styles.valueContainer]: tokens?.length && tokens.length > 1,
              })}
            >
              <FormattedMessage {...MSG.value} />
              <div className={styles.tokenWrapper}>
                {isEmpty(tokens) ? (
                  <div className={styles.empty}>
                    <FormattedMessage {...MSG.noTokens} />
                  </div>
                ) : (
                  tokens?.map((singleToken, index) => {
                    const { token, value } = singleToken || {};
                    return (
                      token && (
                        <div
                          className={classNames(styles.value, {
                            [styles.marginBottom]:
                              tokens.length > 1 && index + 1 !== tokens.length,
                          })}
                          key={token.id}
                        >
                          {formatMessage(MSG.valueWithToken, {
                            token: token.symbol,
                            amount: value,
                            icon: (
                              <span className={styles.icon}>
                                <TokenIcon
                                  className={styles.tokenIcon}
                                  token={token}
                                  name={token?.name || token?.address}
                                />
                              </span>
                            ),
                          })}
                        </div>
                      )
                    );
                  })
                )}
              </div>
            </div>
          </FormSection>
        </>
      )}
      {invalidRows && (
        <div className={classNames(styles.error, styles.fontSmall)}>
          <FormattedMessage
            {...MSG.invalidRows}
            values={{
              button: (
                <Button
                  type="button"
                  onClick={() => {}}
                  appearance={{ theme: 'blue', size: 'small' }}
                  text={MSG.viewAll}
                />
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

Batch.displayName = displayName;

export default Batch;
