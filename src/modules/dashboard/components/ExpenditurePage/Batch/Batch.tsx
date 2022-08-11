import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useField } from 'formik';
import classNames from 'classnames';
import { isEmpty, isNil } from 'lodash';

import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { SpinnerLoader } from '~core/Preloaders';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import IconTooltip from '~core/IconTooltip';

import CSVUploader from './CSVUploader';
import { useCalculateBatchPayment } from './hooks';
import DownloadTemplate from './DownloadTemplate';
import PreviewDialog from './PreviewDialog';
import { Batch as BatchType } from './types';
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
  importedPayments: {
    id: 'dashboard.ExpenditurePage.Batch.importedPayments',
    defaultMessage: 'Imported payments',
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
  noPayments: {
    id: 'dashboard.ExpenditurePage.Batch.noPayments',
    defaultMessage: 'No payments',
  },
  invalidRows: {
    id: 'dashboard.ExpenditurePage.Batch.invalidRows',
    defaultMessage: `Not all rows were imported correctly, please review. {button}`,
  },
  viewAll: {
    id: `dashboard.ExpenditurePage.Batch.viewAll`,
    defaultMessage: 'View all',
  },
  tooltipText: {
    id: `dashboard.ExpenditurePage.Batch.tooltipText`,
    defaultMessage: `Download and use the .csv import template. Be sure to remove the sample data and confirm the details are correct once imported.`,
  },
  fileError: {
    id: 'dashboard.ExpenditurePage.Batch.fileError',
    defaultMessage: `File structure is incorrect, try again using the template.`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Batch';

interface Props {
  colony: Colony;
}

const Batch = ({ colony }: Props) => {
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const [, { value: dataCSVUploader, error }] = useField<
    BatchType['dataCSVUploader']
  >('batch.dataCSVUploader');
  const [, , { setValue: setData }] = useField<BatchType['data']>('batch.data');
  const [, , { setValue: setRecipients }] = useField<BatchType['recipients']>(
    'batch.recipients',
  );
  const [, , { setValue: setBatchValue }] = useField<BatchType['value']>(
    'batch.value',
  );

  const data = useCalculateBatchPayment(
    colony,
    dataCSVUploader?.[0]?.parsedData,
  );
  const { invalidRows, recipientsCount, tokens, validatedData } = data || {};

  useEffect(() => {
    setRecipients(recipientsCount, false);
    setData(validatedData, false);
    setBatchValue(tokens, false);

    // adding setRecipients, setData and setBatchValue to the dependency array causes 'Maximum update depth exceeded' error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, recipientsCount, tokens, validatedData]);

  const errorMessage = useMemo(() => {
    if (typeof error === 'string') {
      return error;
    }
    if (error) {
      const fileError = error?.[0]?.['parsedData'];
      return fileError && 'id' in fileError && formatMessage(fileError);
    }
    return undefined;
  }, [error, formatMessage]);

  const openPreviewDialog = useDialog(PreviewDialog);

  return (
    <div className={styles.batchContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <div className={styles.textIconWrapper}>
            <FormattedMessage {...MSG.batch} />
            <IconTooltip
              icon="question-mark"
              tooltipText={MSG.tooltipText}
              appearance={{ size: 'huge' }}
              tooltipPopperOptions={{
                placement: 'top-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-16, 4],
                    },
                  },
                ],
              }}
            />
          </div>
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
          {validatedData && (
            <Button
              type="button"
              onClick={() => openPreviewDialog({ values: validatedData })}
              appearance={{ theme: 'blue' }}
              text={MSG.viewAll}
            />
          )}
        </div>
      </FormSection>
      {error && <div className={styles.error}>{errorMessage}</div>}
      {data && (
        <>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.dataRow}>
              <FormattedMessage {...MSG.importedPayments} />
              {recipientsCount ? (
                <div className={styles.value}>{recipientsCount}</div>
              ) : (
                <div className={styles.empty}>
                  <FormattedMessage {...MSG.noPayments} />
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

                    if (!token) {
                      return null;
                    }

                    return (
                      <div
                        className={classNames(styles.value, {
                          [styles.marginBottom]:
                            tokens.length > 1 && index + 1 !== tokens.length,
                        })}
                        key={token.id}
                      >
                        <FormattedMessage
                          {...MSG.valueWithToken}
                          values={{
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
                          }}
                        />
                      </div>
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
                  onClick={() => openPreviewDialog({ values: validatedData })}
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
