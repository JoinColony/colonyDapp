import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classnames from 'classnames';
import { nanoid } from 'nanoid';
import { FormikProps } from 'formik';

import { DialogSection } from '~core/Dialog';
import { Annotations, Input, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import Button from '~core/Button';
import Icon from '~core/Icon';
import Avatar from '~core/Avatar';
import MaskedAddress from '~core/MaskedAddress';
import { AnyUser, Colony } from '~data/index';
import { AbiItemExtended, getArrayFromString } from '~utils/safes';
import { extractTokenName } from '~modules/dashboard/sagas/utils/safeHelpers';
import { omit } from '~utils/lodash';

import AddressDetailsView from './TransactionPreview/AddressDetailsView';
import { defaultTransaction, FormValues } from './ControlSafeDialog';
import {
  TransactionTypes,
  transactionOptions,
  MSG as ConstantsMSG,
} from './constants';
import DetailsItem from './DetailsItem';

import styles from './SafeTransactionPreview.css';
import { NFT } from './TransactionTypesSection/TransferNFTSection';

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
      key: 'nftData',
      label: MSG.nftHeldByTheSafe,
      value: (nftData: NFT) => (
        <div className={styles.nftContainer}>
          <Avatar
            avatarURL={nftData.imageUri || undefined}
            placeholderIcon="nft-icon"
            seed={nftData.address.toLocaleLowerCase()}
            title=""
            size="xs"
            className={styles.avatar}
          />
          <div className={styles.itemValue}>
            {extractTokenName(nftData.name || nftData.tokenName)}
          </div>
        </div>
      ),
    },
    {
      key: 'nftData',
      label: MSG.nftId,
      value: (nftData) => <div className={styles.itemValue}>{nftData.id}</div>,
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
          <span className={styles.contractName}>
            {contract.profile.displayName}
          </span>
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
  isVotingExtensionEnabled: boolean;
  userHasPermission: boolean;
  isSubmitting: boolean;
  onlyForceAction: boolean;
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
  isVotingExtensionEnabled,
  userHasPermission,
  isSubmitting,
  onlyForceAction,
  setFieldValue,
}: Props & Pick<FormikProps<FormValues>, 'setFieldValue'>) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState(
    Array(values.transactions.length).fill(false),
  );
  const { formatMessage } = useIntl();

  const tokens = useMemo(() => values.transactions.map((t) => t.tokenData), [
    values,
  ]);

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
    const inputName = `${input.name}-${transaction.contractFunction}`;
    switch (true) {
      case input.type === 'address': {
        return <MaskedAddress address={transaction[inputName]} />;
      }
      case input.type === 'address[]': {
        const formattedArray = getArrayFromString(transaction[inputName]);

        const maskedArray = formattedArray.map((address, index, arr) => {
          return (
            <div key={nanoid()}>
              <MaskedAddress address={address.trim()} />
              {index < arr.length - 1 && <span>, </span>}
            </div>
          );
        });
        return <div className={styles.rawTransactionValues}>{maskedArray}</div>;
      }
      case input.type.substr(input.type.length - 2, input.type.length) ===
        '[]': {
        const formattedArray = `[${getArrayFromString(transaction[inputName])
          .map((item) => item.trim())
          .join(', ')}]`;
        return (
          <div className={styles.rawTransactionValues}>{formattedArray}</div>
        );
      }
      default:
        return (
          <div className={styles.rawTransactionValues}>
            {transaction[inputName]}
          </div>
        );
    }
  };

  /*
   * Remove unused contract functions from form state.
   * Doing it here instead of in the Contract Interaction section so that the user doesn't lose state in the
   * event they switch between contract functions. We need this so the correct functions appear on the actions page.
   */
  useEffect(() => {
    values.transactions.forEach((transaction, index) => {
      const actualSelectedFunction = transaction.contractFunction;
      const allSelectedMethodKeys = Object.keys(
        omit(transaction, Object.keys(defaultTransaction)),
      );
      const keysToExclude = allSelectedMethodKeys.filter(
        // the keys end with "-[functionName]", so we exclude the ones that don't end in the
        // function name that the user ended up choosing
        (key) => !new RegExp(`-${actualSelectedFunction}$`).test(key),
      );
      const updatedTransaction = {
        ...omit(transaction, keysToExclude),
      };
      setFieldValue(`transactions.${index}`, updatedTransaction);
    });
    // initialisation only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.motionHeading}>
          {isVotingExtensionEnabled && (
            <MotionDomainSelect
              colony={colony}
              /*
               * @NOTE Always disabled since you can only create this motion in root
               */
              disabled
            />
          )}
          {userHasPermission && isVotingExtensionEnabled && (
            <Toggle
              label={{ id: 'label.force' }}
              name="forceAction"
              disabled={isSubmitting}
            />
          )}
        </div>
      </DialogSection>
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
            disabled={onlyForceAction}
          />
        </DialogSection>
        <DialogSection>
          <Annotations
            label={MSG.description}
            name="annotation"
            disabled={onlyForceAction}
          />
        </DialogSection>
        {onlyForceAction && (
          <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
        )}
      </div>
    </>
  );
};

SafeTransactionPreview.displayName = displayName;

export default SafeTransactionPreview;
