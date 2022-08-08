import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useField } from 'formik';
import classNames from 'classnames';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { SpinnerLoader } from '~core/Preloaders';

import CSVUploader from './CSVUploader';
import { calculateBatch } from './utils';
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
  downloadTemplate: {
    id: 'dashboard.ExpenditurePage.Batch.downloadTemplate',
    defaultMessage: 'Download template',
  },
  upload: {
    id: 'dashboard.ExpenditurePage.Batch.upload',
    defaultMessage: 'Upload .CSV',
  },
  hide: {
    id: 'dashboard.ExpenditurePage.Batch.hide',
    defaultMessage: 'Hide',
  },
  viewAll: {
    id: 'dashboard.ExpenditurePage.Batch.viewAll',
    defaultMessage: 'View all',
  },
  clear: {
    id: 'dashboard.ExpenditurePage.Batch.clear',
    defaultMessage: 'Clear',
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
});

const displayName = 'dashboard.ExpenditurePage.Batch';

interface Props {
  colony: Colony;
}

const Batch = ({ colony }: Props) => {
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const [, { value: batch }] = useField('batch');
  const batchData = batch?.dataCSVUploader?.[0]?.parsedData;
  const processedData = useMemo(() => calculateBatch(colony, batchData), [
    batchData,
    colony,
  ]);

  const { value, tokens, recipientsCount } = processedData || {};

  useEffect(() => {
    if (processingCSVData) {
      setOpen(false);
    }
  }, [processingCSVData]);

  return (
    <div className={styles.batchContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <FormattedMessage {...MSG.batch} />
          {!batchData ? (
            <Button appearance={{ theme: 'blue' }} type="button">
              {formatMessage(MSG.downloadTemplate)}
            </Button>
          ) : (
            <Button appearance={{ theme: 'blue' }} type="button">
              {formatMessage(MSG.clear)}
            </Button>
          )}
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.data}>
          <FormattedMessage {...MSG.data} />
          <div>
            {processingCSVData && <SpinnerLoader />}
            {!isOpen && !batchData && (
              <Button
                appearance={{ theme: 'blue' }}
                type="button"
                onClick={() => setOpen((open) => !open)}
              >
                {formatMessage(MSG.upload)}
              </Button>
            )}
            {batchData && (
              <Button
                appearance={{ theme: 'blue' }}
                type="button"
                onClick={() => {}}
              >
                {formatMessage(MSG.viewAll)}
              </Button>
            )}
          </div>
        </div>
        <CSVUploader
          name="batch.dataCSVUploader"
          error={undefined}
          processingData={processingCSVData}
          setProcessingData={setProcessingCSVData}
          isOpen={isOpen}
        />
      </FormSection>
      {recipientsCount && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.dataRow}>
            <FormattedMessage {...MSG.recipients} />
            <div className={styles.value}>{recipientsCount}</div>
          </div>
        </FormSection>
      )}
      {value && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div
            className={classNames(styles.valueRow, {
              [styles.valueContainer]: tokens?.length && tokens.length > 1,
            })}
          >
            <FormattedMessage {...MSG.value} />
            <div className={styles.tokenWrapper}>
              {tokens?.map(
                ({ token, amount }, index) =>
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
                        amount:
                          typeof amount === 'number' ? amount.toString() : '',
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
                  ),
              )}
            </div>
          </div>
        </FormSection>
      )}
    </div>
  );
};

Batch.displayName = displayName;

export default Batch;
