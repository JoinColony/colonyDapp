import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classnames from 'classnames';
import { nanoid } from 'nanoid';

import { DialogSection } from '~core/Dialog';
import { Annotations, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import Icon from '~core/Icon';
import Avatar from '~core/Avatar';
import MaskedAddress from '~core/MaskedAddress';
import { Colony, AnyUser } from '~data/index';
import { AbiItemExtended, getArrayFromString } from '~utils/safes';

import AddressDetailsView from './TransactionPreview/AddressDetailsView';
import { FormValues } from './ControlSafeDialog';
import {
  TransactionTypes,
  transactionOptions,
  MSG as ConstantsMSG,
} from './constants';
import DetailsItem from './DetailsItem';

import styles from './SafeTransactionPreview.css';

const MSG = defineMessages({
  previewTitle: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.previewTitle',
    defaultMessage: 'Confirm transaction details',
  },
  transactionsTitle: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.transactionsTitle`,
    defaultMessage: 'Title',
  },
  description: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.description',
    defaultMessage: 'Description (optional)',
  },
  safe: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.safe`,
    defaultMessage: 'Safe',
  },
  function: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.function',
    defaultMessage: 'Function',
  },
  to: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.amount',
    defaultMessage: 'Amount',
  },
  contract: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.contract',
    defaultMessage: 'Contract',
  },
  abi: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.abi',
    defaultMessage: 'ABI',
  },
  nft: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.nft',
    defaultMessage: 'NFT',
  },
  transactionType: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.transactionType`,
    defaultMessage: 'Transaction type',
  },
  nftHeldByTheSafe: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.nftHeldByTheSafe`,
    defaultMessage: 'NFT held by the safe',
  },
  targetContract: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.targetContract`,
    defaultMessage: 'Target contract',
  },
  nftId: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.nftId',
    defaultMessage: 'Id',
  },
  data: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.data',
    defaultMessage: 'Data',
  },
  contractFunction: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.contractFunction`,
    defaultMessage: 'Contract function',
  },
  value: {
    id: 'dashboard.ControlSafeDialog.SafeTransactionPreview.value',
    defaultMessage: 'Value (wei)',
  },
  transactionTitle: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.transactionTitle`,
    defaultMessage: `{transactionNumber}. {transactionType, select, undefined {} other {{transactionType}}}`,
  },
  toggleTransaction: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} false {Close}} transaction',
  },
  contractMethodInputLabel: {
    id: `dashboard.ControlSafeDialog.SafeTransactionPreview.contractMethodInputLabel`,
    defaultMessage: `{name} ({type})`,
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
    {
      key: 'transactionType',
      label: MSG.transactionType,
      value: () => <FormattedMessage {...ConstantsMSG.transferNft} />,
    },
    {
      key: 'nft',
      label: MSG.nftHeldByTheSafe,
      value: (nft) => (
        <div className={styles.nftContainer}>
          <Avatar
            avatarURL={undefined}
            placeholderIcon="circle-close"
            seed={nft.profile.walletAddress.toLocaleLowerCase()}
            title=""
            size="xs"
          />
          <div>{nft.profile.displayName}</div>
        </div>
      ),
    },
    {
      key: 'nftData',
      label: MSG.targetContract,
      value: (nftData) => (
        <div className={styles.nftContainer}>
          <Avatar
            avatarURL={undefined}
            placeholderIcon="circle-close"
            seed={nftData.address.toLocaleLowerCase()}
            title=""
            size="xs"
          />
          <div>{nftData.name || nftData.tokenName}</div>
        </div>
      ),
    },
    {
      key: 'nftData',
      label: MSG.nftId,
      value: (nftData) => <div>{nftData.id}</div>,
    },
    {
      key: 'recipient',
      label: MSG.to,
      value: (recipient) => (
        <AddressDetailsView item={recipient} isSafeItem={false} />
      ),
    },
  ],
  [TransactionTypes.CONTRACT_INTERACTION]: [
    {
      key: 'contract',
      label: MSG.contract,
      value: (contract) => (
        <div className={styles.rawTransactionValues}>
          <MaskedAddress address={contract.profile.displayName} />
        </div>
      ),
    },
    {
      key: 'contractFunction',
      label: MSG.contractFunction,
      value: (contractFunction) => (
        <div className={styles.rawTransactionValues}>{contractFunction}</div>
      ),
    },
  ],
  [TransactionTypes.RAW_TRANSACTION]: [
    {
      key: 'rawAmount',
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

const displayName = 'dashboard.ControlSafeDialog.SafeTransactionPreview';

interface Props {
  colony: Colony;
  values: FormValues;
  selectedContractMethods?:
    | {
        [key: number]: AbiItemExtended | undefined;
      }
    | undefined;
}

const SafeTransactionPreview = ({
  colony,
  values,
  selectedContractMethods,
}: Props) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState(
    Array(values.transactions.length).fill(false),
  );
  const { formatMessage } = useIntl();

  const tokens = useMemo(() => {
    return values.transactions.map((transaction) => {
      const token = colony.tokens.find(
        (item) => item.address === transaction.tokenAddress,
      );
      return token;
    });
  }, [values, colony.tokens]);

  const handleTabToggle = (newIndex: number) => {
    const newTransactionTabs = transactionTabStatus.map((tab, index) =>
      index === newIndex ? !tab : tab,
    );
    setTransactionTabStatus([...newTransactionTabs]);
  };

  const getTransactionTypeLabel = (transactionTypeValue: string) => {
    const transactionType = transactionOptions.find(
      (transaction) => transaction.value === transactionTypeValue,
    );
    return transactionType ? formatMessage(transactionType.label) : null;
  };

  const autogeneratedIds = useMemo(
    () => [...new Array(values.transactions.length)].map(nanoid),
    [values.transactions.length],
  );

  const isNFT = (index) =>
    values.transactions[index].transactionType ===
    TransactionTypes.TRANSFER_NFT;

  const getDetailsItemValue = (input, transaction) => {
    switch (true) {
      case input.type === 'address': {
        return <MaskedAddress address={transaction[input.name]} />;
      }
      case input.type === 'address[]': {
        const formattedArray = getArrayFromString(transaction[input.name]);

        const maskedArray = formattedArray.map((address, index, arr) => {
          return (
            <div>
              <MaskedAddress address={address.trim()} />
              {index < arr.length - 1 && <span>, </span>}
            </div>
          );
        });
        return <div className={styles.rawTransactionValues}>{maskedArray}</div>;
      }
      case input.type.substr(input.type.length - 2, input.type.length) ===
        '[]': {
        const formattedArray = `[${getArrayFromString(transaction[input.name])
          .map((item) => item.trim())
          .join(', ')}]`;
        return (
          <div className={styles.rawTransactionValues}>{formattedArray}</div>
        );
      }
      default:
        return (
          <div className={styles.rawTransactionValues}>
            {transaction[input.name]}
          </div>
        );
    }
  };

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
                  ),
                }}
              />
              <Button
                className={styles.tabButton}
                onClick={() => handleTabToggle(index)}
              >
                <Icon
                  name="caret-up"
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
            <DialogSection appearance={{ theme: 'sidePadding' }}>
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
                {!isNFT(index) && (
                  <DetailsItem
                    label={MSG.safe}
                    value={
                      <AddressDetailsView
                        item={(values.safe as never) as AnyUser}
                        isSafeItem
                      />
                    }
                  />
                )}
                {values.transactions[index].transactionType !==
                  TransactionTypes.CONTRACT_INTERACTION &&
                  !isNFT(index) && (
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
                  ].map(({ key, label, value }) => (
                    <DetailsItem
                      key={nanoid()}
                      label={label}
                      value={value(
                        values.transactions[index][key],
                        tokens[index],
                      )}
                    />
                  ))}
                {values.transactions[index].transactionType ===
                  TransactionTypes.CONTRACT_INTERACTION &&
                  selectedContractMethods &&
                  selectedContractMethods[index]?.inputs?.map((input) => (
                    <DetailsItem
                      key={nanoid()}
                      label={MSG.contractMethodInputLabel}
                      textValues={{ name: input.name, type: input.type }}
                      value={getDetailsItemValue(
                        input,
                        values.transactions[index],
                      )}
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
