import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { nanoid } from 'nanoid';

import { DialogSection } from '~core/Dialog';
import { Annotations, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import Icon from '~core/Icon';

import { Colony, AnyUser } from '~data/index';
import { PrimitiveType } from '~types/index';

import AddressDetailsView from './TransactionPreview/AddressDetailsView';
import { FormValues } from './GnosisControlSafeDialog';
import {
  TransactionTypes,
  transactionOptions,
  MSG as ConstantsMSG,
} from './constants';
import DetailsItem from './DetailsItem';

import styles from './GnosisControlSafeForm.css';

const MSG = defineMessages({
  previewTitle: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.previewTitle',
    defaultMessage: 'Confirm transaction details',
  },
  transactionsTitle: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.transactionsTitle`,
    defaultMessage: 'Title',
  },
  description: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.description',
    defaultMessage: 'Description (optional)',
  },
  safe: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.safe`,
    defaultMessage: 'Safe',
  },
  function: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.function',
    defaultMessage: 'Function',
  },
  to: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.amount',
    defaultMessage: 'Amount',
  },
  contract: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.contract',
    defaultMessage: 'Contract',
  },
  abi: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.abi',
    defaultMessage: 'ABI',
  },
  nft: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.nft',
    defaultMessage: 'NFT',
  },
  data: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.data',
    defaultMessage: 'Data',
  },
  contractFunction: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.contractFunction`,
    defaultMessage: 'Contract function',
  },
  value: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.value',
    defaultMessage: 'Value (wei)',
  },
  transactionTitle: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.transactionTitle`,
    defaultMessage: `{transactionNumber}. {transactionType, select, undefined {} other {{transactionType}}}`,
  },
  toggleTransaction: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} false {Close}} transaction',
  },
});

const transactionTypeFieldsMap = {
  [TransactionTypes.TRANSFER_FUNDS]: [
    {
      key: 'amount',
      label: MSG.amount,
      value: (amount, token) => (
        <div className={styles.tokenAmount}>
          <TokenIcon token={token} size="xxs" />
          <Numeral value={amount} suffix={token.symbol} />
        </div>
      ),
    },
  ],
  [TransactionTypes.TRANSFER_NFT]: [
    // To be finished once NFT part of the form is merged
    {
      key: 'function',
      label: MSG.function,
      value: () => <FormattedMessage {...ConstantsMSG.transferNft} />,
    },
  ],
  [TransactionTypes.CONTRACT_INTERACTION]: [
    // To be finished once NFT part of the form is merged
  ],
  [TransactionTypes.RAW_TRANSACTION]: [
    {
      key: 'amount',
      label: MSG.value,
      value: (value) => (
        <div className={styles.rawTransactionValues}>{value}</div>
      ),
    },
    {
      key: 'data',
      label: MSG.data,
      value: (data) => (
        <div className={styles.rawTransactionValues}>{data}</div>
      ),
    },
  ],
};

const displayName = 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview';

interface Props {
  colony: Colony;
  values: FormValues;
}

const SafeTransactionPreview = ({ colony, values }: Props) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState(
    Array(values.transactions.length).fill(false),
  );

  const tokens = useMemo(() => {
    return values.transactions.map((transaction) => {
      const token = colony.tokens.find(
        (item) => item.address === transaction.tokenAddress,
      );
      return token;
    });
  }, [values, colony.tokens]);

  const handleTabToggle = useCallback(
    (newIndex: number) => {
      const newTransactionTabs = transactionTabStatus.map((tab, index) =>
        index === newIndex ? !tab : tab,
      );
      setTransactionTabStatus([...newTransactionTabs]);
    },
    [transactionTabStatus, setTransactionTabStatus],
  );
  const getTransactionTypeLabel = useCallback(
    (transactionTypeValue: string) => {
      const transactionType = transactionOptions.find(
        (transaction) => transaction.value === transactionTypeValue,
      );
      return transactionType ? (
        <FormattedMessage {...transactionType.label} />
      ) : null;
    },
    [],
  );
  const autogeneratedIds = useMemo(
    () => [...new Array(values.transactions.length)].map(nanoid),
    [values.transactions.length],
  );

  return (
    <>
      <DialogSection>
        <div className={styles.heading}>
          <Heading
            appearance={{
              size: 'medium',
              margin: 'none',
              theme: 'dark',
            }}
            text={MSG.previewTitle}
          />
        </div>
      </DialogSection>

      {values.transactions.map((transaction, index) => (
        <div key={autogeneratedIds[index]}>
          {values.transactions.length > 1 && (
            <div
              className={classnames(styles.transactionHeading, {
                [styles.transactionHeadingOpen]: transactionTabStatus[index],
              })}
            >
              <Heading
                appearance={{
                  size: 'normal',
                  margin: 'none',
                  theme: 'dark',
                }}
                text={MSG.transactionTitle}
                textValues={{
                  transactionNumber: index + 1,
                  transactionType: getTransactionTypeLabel(
                    transaction.transactionType,
                    /* Need casting as `formatValues` func used in Heading
                            doesn't have correct types (coming from react-intl) */
                  ) as PrimitiveType,
                }}
              />
              <Button
                className={styles.tabButton}
                onClick={() => handleTabToggle(index)}
              >
                <Icon
                  name="caret-up-small"
                  className={styles.toggleTabIcon}
                  title={MSG.toggleTransaction}
                  titleValues={{
                    tabToggleStatus: transactionTabStatus[index],
                  }}
                />
              </Button>
            </div>
          )}
          <div
            className={classnames({
              [styles.tabContentClosed]:
                values.transactions.length > 1 && !transactionTabStatus[index],
            })}
          >
            <DialogSection>
              <div className={styles.transactionDetailsSection}>
                {values.transactions[index].transactionType !== '' &&
                  values.transactions.length === 1 && (
                    <div className={styles.transactionTitle}>
                      1.{' '}
                      <FormattedMessage
                        {...ConstantsMSG[
                          values.transactions[index].transactionType
                        ]}
                      />
                    </div>
                  )}
                <DetailsItem
                  label={MSG.safe}
                  value={
                    <AddressDetailsView
                      item={(values.safe as never) as AnyUser}
                      isSafeItem
                    />
                  }
                />
                {values.transactions[index].transactionType !==
                  TransactionTypes.CONTRACT_INTERACTION && (
                  <DetailsItem
                    label={MSG.to}
                    value={
                      <AddressDetailsView
                        item={
                          (values.transactions[index]
                            .recipient as never) as AnyUser
                        }
                        isSafeItem={false}
                      />
                    }
                  />
                )}
                {values.transactions[index].transactionType !== '' &&
                  transactionTypeFieldsMap[
                    values.transactions[index].transactionType
                  ].map(({ key, label, value }, idx, arr) => (
                    <DetailsItem
                      key={key}
                      label={label}
                      value={value(
                        values.transactions[index][key],
                        tokens[index],
                      )}
                      isLastItem={idx + 1 === arr.length}
                    />
                  ))}
              </div>
            </DialogSection>
          </div>
        </div>
      ))}
      <div className={styles.footer}>
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <Input
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            label={MSG.transactionsTitle}
            name="transactionsTitle"
            placeholder=""
          />
        </DialogSection>
        <DialogSection>
          <Annotations label={MSG.description} name="annotation" />
        </DialogSection>
      </div>
    </>
  );
};

SafeTransactionPreview.displayName = displayName;

export default SafeTransactionPreview;
