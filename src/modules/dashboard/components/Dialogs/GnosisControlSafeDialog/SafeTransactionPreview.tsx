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

import { TransactionTypes } from './constants';
import styles from './GnosisControlSafeForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.title',
    defaultMessage: 'Control Safe',
  },
  description: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.description',
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.selectSafe',
    defaultMessage: 'Select Safe',
  },
  safePickerPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.safePickerPlaceholder`,
    defaultMessage: 'Select Safe to control',
  },
  transactionLabel: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.transactionLabel`,
    defaultMessage: 'Select transaction type',
  },
  transactionPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.transactionPlaceholder`,
    defaultMessage: 'Select transaction',
  },
  buttonTransaction: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.buttonTransaction`,
    defaultMessage: 'Add another transaction',
  },
  buttonCreateTransaction: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.buttonCreateTransaction`,
    defaultMessage: 'Create transaction',
  },
  transactionTitle: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.transactionTitle`,
    defaultMessage: `Transaction #{transactionNumber} {transactionType, select, undefined {} other {({transactionType})}}`,
  },
  toggleTransaction: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} false {Close}} transaction',
  },
  deleteTransaction: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.deleteTransaction`,
    defaultMessage: 'Delete transaction',
  },
  deleteTransactionTooltipText: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.deleteTransactionTooltipText`,
    defaultMessage: `Delete transaction.\nBe careful, data can be lost.`,
  },
  previewTitle: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.previewTitle',
    defaultMessage: 'Confirm transaction details',
  },
  transactionsSetTitle: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.transactionsSetTitle`,
    defaultMessage: 'Title of the set of all the arbitrary transactions',
  },
  explainWhy: {
    id: 'dashboard.GnosisControlSafeDialog.SafeTransactionPreview.explainWhy',
    defaultMessage: `Explain why you’re making arbitrary transaction (optional)`,
  },
  targetContract: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.targetContract`,
    defaultMessage: 'Target contract',
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
    defaultMessage: 'Value',
  },
  [TransactionTypes.TRANSFER_FUNDS]: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.${TransactionTypes.TRANSFER_FUNDS}`,
    defaultMessage: 'Transfer funds',
  },
  [TransactionTypes.TRANSFER_NFT]: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.${TransactionTypes.TRANSFER_NFT}`,
    defaultMessage: 'Transfer NFT',
  },
  [TransactionTypes.CONTRACT_INTERACTION]: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.${TransactionTypes.CONTRACT_INTERACTION}`,
    defaultMessage: 'Contract interaction',
  },
  [TransactionTypes.RAW_TRANSACTION]: {
    id: `dashboard.GnosisControlSafeDialog.SafeTransactionPreview.${TransactionTypes.RAW_TRANSACTION}`,
    defaultMessage: 'Raw transaction',
  },
});

export const transactionOptions = [
  {
    value: TransactionTypes.TRANSFER_FUNDS,
    label: MSG[TransactionTypes.TRANSFER_FUNDS],
    labelString: 'Transfer funds',
  },
  {
    value: TransactionTypes.TRANSFER_NFT,
    label: MSG[TransactionTypes.TRANSFER_NFT],
    labelString: 'Transfer NFT',
  },
  {
    value: TransactionTypes.CONTRACT_INTERACTION,
    label: MSG[TransactionTypes.CONTRACT_INTERACTION],
    labelString: 'Contract interaction',
  },
  {
    value: TransactionTypes.RAW_TRANSACTION,
    label: MSG[TransactionTypes.RAW_TRANSACTION],
    labelString: 'Raw transaction',
  },
];

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
    {
      key: 'nft',
      label: MSG.nft,
      value: (nft) => <span>{`${nft.name} #${nft.number}`}</span>,
    },
  ],
  [TransactionTypes.CONTRACT_INTERACTION]: [
    {
      key: 'contract',
      label: MSG.contract,
      value: (contract) => contract,
    },
    {
      key: 'abi',
      label: MSG.abi,
      value: (abi) => abi,
    },
    {
      key: 'contractFunction',
      label: MSG.contractFunction,
      value: (contractFunction) => contractFunction,
    },
  ],
  [TransactionTypes.RAW_TRANSACTION]: [
    {
      key: 'value',
      label: MSG.value,
      value: (value) => value,
    },
    {
      key: 'data',
      label: MSG.data,
      value: (data) => data,
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
    () => transactionTypeFieldsMap[values.transactions[0].transactionType],
    [values],
  );

  const token = useMemo(
    () =>
      tokens.find(
        (item) => item.address === values.transactions[0].tokenAddress,
      ),
    [values, tokens],
  );

  const DetailsItem = ({ label, value }: { label: any; value: any }) => (
    <div className={styles.detailsItem}>
      <div className={styles.detailsItemLabel}>
        <FormattedMessage {...label} />
      </div>
      <div className={styles.detailsItemValue}>{value}</div>
    </div>
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
        <div className={styles.transactionTitle}>
          1.{' '}
          <FormattedMessage {...MSG[values.transactions[0].transactionType]} />
        </div>
        <DetailsItem
          label={MSG.targetContract}
          value={
            <AddressDetailsView
              item={(values.safe as never) as AnyUser}
              isSafeItem
            />
          }
        />
        <DetailsItem
          label={MSG.function}
          value={
            <FormattedMessage
              {...MSG[values.transactions[0].transactionType]}
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
        {transactionDetails.map(({ key, label, value }) => (
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
          label={MSG.transactionsSetTitle}
          name="transactionSetTitle"
          disabled={false}
        />
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.explainWhy} name="annotation" />
      </DialogSection>
    </>
  );
};

SafeTransactionPreview.displayName = displayName;

export default SafeTransactionPreview;
