import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogSection } from '~core/Dialog';
import { Annotations, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { Colony, AnyUser } from '~data/index';

import AddressDetailsView from './TransactionPreview/AddressDetailsView';
import { FormValues } from './GnosisControlSafeDialog';
import { TransactionTypes, MSG as ConstantsMSG } from './constants';
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

const SafeTransactionPreview = ({ colony: { tokens }, values }: Props) => {
  const transactionDetails = useMemo(
    () =>
      values.transactions[0].transactionType === ''
        ? []
        : transactionTypeFieldsMap[values.transactions[0].transactionType],
    [values],
  );

  const token = useMemo(
    () =>
      tokens.find(
        (item) => item.address === values.transactions[0].tokenAddress,
      ),
    [values, tokens],
  );

  return (
    <>
      <DialogSection>
        <div className={styles.heading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.previewTitle}
          />
        </div>
      </DialogSection>
      <DialogSection>
        {values.transactions[0].transactionType !== '' && (
          <div className={styles.transactionTitle}>
            1.{' '}
            <FormattedMessage
              {...ConstantsMSG[values.transactions[0].transactionType]}
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
        {values.transactions[0].transactionType !==
          TransactionTypes.CONTRACT_INTERACTION && (
          <DetailsItem
            label={MSG.to}
            value={
              <AddressDetailsView
                item={(values.transactions[0].recipient as never) as AnyUser}
                isSafeItem={false}
              />
            }
          />
        )}
        {transactionDetails?.map(({ key, label, value }) => (
          <DetailsItem
            key={key}
            label={label}
            value={value(values.transactions[0][key], token)}
          />
        ))}
      </DialogSection>
      <DialogSection>
        <Input
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          label={MSG.transactionsTitle}
          name="transactionSetTitle"
          disabled={false}
          placeholder=""
        />
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.description} name="annotation" />
      </DialogSection>
    </>
  );
};

SafeTransactionPreview.displayName = displayName;

export default SafeTransactionPreview;
