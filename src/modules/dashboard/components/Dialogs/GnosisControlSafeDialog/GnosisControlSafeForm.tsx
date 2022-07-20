import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import classnames from 'classnames';
import { nanoid } from 'nanoid';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import { Annotations, Input, Select } from '~core/Fields';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import Button, { AddItemButton } from '~core/Button';
import Icon from '~core/Icon';
import { SingleSafePicker, filterUserSelection } from '~core/SingleUserPicker';
import IconTooltip from '~core/IconTooltip';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { GNOSIS_SAFE_INTEGRATION_LEARN_MORE } from '~externalUrls';
import { Colony, useLoggedInUser, AnyUser } from '~data/index';
import { Address } from '~types/index';

import AddressDetailsView from './TransactionPreview/AddressDetailsView';

import { FormValues } from './GnosisControlSafeDialog';
import {
  TransferFundsSection,
  RawTransactionSection,
  ContractInteractionSection,
} from './TransactionTypesSection';

import styles from './GnosisControlSafeForm.css';

export enum TransactionTypes {
  TRANSFER_FUNDS = 'transferFunds',
  TRANSFER_NFT = 'transferNft',
  CONTRACT_INTERACTION = 'contractInteraction',
  RAW_TRANSACTION = 'rawTransaction',
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.title',
    defaultMessage: 'Control Safe',
  },
  description: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.description',
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.selectSafe',
    defaultMessage: 'Select Safe',
  },
  safePickerPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.safePickerPlaceholder`,
    defaultMessage: 'Select Safe to control',
  },
  transactionLabel: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.transactionLabel`,
    defaultMessage: 'Select transaction type',
  },
  transactionPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.transactionPlaceholder`,
    defaultMessage: 'Select transaction',
  },
  buttonTransaction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.buttonTransaction`,
    defaultMessage: 'Add another transaction',
  },
  buttonCreateTransaction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.buttonCreateTransaction`,
    defaultMessage: 'Create transaction',
  },
  transactionTitle: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.transactionTitle`,
    defaultMessage: `Transaction #{transactionNumber} {transactionType, select, undefined {} other {({transactionType})}}`,
  },
  toggleTransaction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} false {Close}} transaction',
  },
  deleteTransaction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.deleteTransaction`,
    defaultMessage: 'Delete transaction',
  },
  deleteTransactionTooltipText: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.deleteTransactionTooltipText`,
    defaultMessage: `Delete transaction.\nBe careful, data can be lost.`,
  },
  previewTitle: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.previewTitle',
    defaultMessage: 'Confirm transaction details',
  },
  transactionsSetTitle: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.transactionsSetTitle`,
    defaultMessage: 'Title of the set of all the arbitrary transactions',
  },
  explainWhy: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.explainWhy',
    defaultMessage: `Explain why you’re making arbitrary transaction (optional)`,
  },
  targetContract: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.targetContract`,
    defaultMessage: 'Target contract',
  },
  function: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.function',
    defaultMessage: 'Function',
  },
  to: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.amount',
    defaultMessage: 'Amount',
  },
  contract: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.contract',
    defaultMessage: 'Contract',
  },
  abi: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.abi',
    defaultMessage: 'ABI',
  },
  nft: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.nft',
    defaultMessage: 'NFT',
  },
  data: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.data',
    defaultMessage: 'Data',
  },
  contractFunction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.contractFunction`,
    defaultMessage: 'Contract function',
  },
  value: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.value',
    defaultMessage: 'Value',
  },
  [TransactionTypes.TRANSFER_FUNDS]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.TRANSFER_FUNDS}`,
    defaultMessage: 'Transfer funds',
  },
  [TransactionTypes.TRANSFER_NFT]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.TRANSFER_NFT}`,
    defaultMessage: 'Transfer NFT',
  },
  [TransactionTypes.CONTRACT_INTERACTION]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.CONTRACT_INTERACTION}`,
    defaultMessage: 'Contract interaction',
  },
  [TransactionTypes.RAW_TRANSACTION]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.RAW_TRANSACTION}`,
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

const displayName = 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm';

export interface GnosisSafe {
  name: string;
  address: Address;
  chain: string;
}

interface Props {
  colony: Colony;
  safes: GnosisSafe[];
  isVotingExtensionEnabled: boolean;
  back?: () => void;
}

const renderAvatar = (address: string, item) => (
  <Avatar
    seed={address.toLocaleLowerCase()}
    size="xs"
    notSet={false}
    title={item.name}
    placeholderIcon="at-sign-circle"
  />
);

const GnosisControlSafeForm = ({
  colony,
  colony: { tokens },
  back,
  handleSubmit,
  safes,
  isSubmitting,
  isValid,
  values,
  isVotingExtensionEnabled,
  setFieldValue,
}: Props & FormikProps<FormValues>) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const [showPreview, setShowPreview] = useState(false);

  const { walletAddress } = useLoggedInUser();
  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);
  const userHasFundingPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Funding,
  );
  const userHasRootPermission = userHasRole(fromDomainRoles, ColonyRole.Root);
  const hasRoles = userHasFundingPermission && userHasRootPermission;
  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    hasRoles,
    isVotingExtensionEnabled,
    values.forceAction,
  );
  const handleTabRemoval = useCallback(
    (arrayHelpers: FieldArrayRenderProps, index: number) => {
      arrayHelpers.remove(index);
      const newTransactionTabStatus = [...transactionTabStatus];
      newTransactionTabStatus.splice(index, 1);
      setTransactionTabStatus(newTransactionTabStatus);
    },
    [transactionTabStatus, setTransactionTabStatus],
  );
  const handleNewTab = useCallback(
    (arrayHelpers: FieldArrayRenderProps) => {
      arrayHelpers.push({
        transactionType: '',
        tokenAddress: colony.nativeTokenAddress,
        amount: undefined,
        recipient: null,
        data: '',
        contract: '',
        abi: '',
        contractFunction: '',
      });
      setTransactionTabStatus([
        ...Array(transactionTabStatus.length).fill(false),
        true,
      ]);
    },
    [colony.nativeTokenAddress, setTransactionTabStatus, transactionTabStatus],
  );
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
      return transactionType?.labelString;
    },
    [],
  );
  const autogeneratedIds = useMemo(
    () => [...new Array(values.transactions.length)].map(nanoid),
    [values.transactions.length],
  );

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

  return !showPreview ? (
    // return false ? (
    <>
      <DialogSection>
        <div className={styles.heading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <FormattedMessage
          {...MSG.description}
          values={{
            a: (chunks) => (
              <ExternalLink href={GNOSIS_SAFE_INTEGRATION_LEARN_MORE}>
                {chunks}
              </ExternalLink>
            ),
          }}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.safePicker}>
          <SingleSafePicker
            appearance={{ width: 'wide' }}
            label={MSG.selectSafe}
            name="safe"
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            data={safes}
            showMaskedAddress
            disabled={!userHasPermission || isSubmitting}
            placeholder={MSG.safePickerPlaceholder}
          />
        </div>
      </DialogSection>
      <FieldArray
        name="transactions"
        render={(arrayHelpers) => (
          <>
            {values.transactions.map((transaction, index) => (
              <div key={autogeneratedIds[index]}>
                {values.transactions.length > 1 && (
                  <div
                    className={classnames(styles.transactionHeading, {
                      [styles.transactionHeadingOpen]:
                        transactionTabStatus[index],
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
                      onClick={() => handleTabRemoval(arrayHelpers, index)}
                    >
                      <IconTooltip
                        icon="trash"
                        className={styles.deleteTabIcon}
                        tooltipClassName={styles.deleteTabTooltip}
                        iconTitle={MSG.deleteTransaction}
                        tooltipText={MSG.deleteTransactionTooltipText}
                      />
                    </Button>
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
                      values.transactions.length > 1 &&
                      !transactionTabStatus[index],
                  })}
                >
                  <DialogSection appearance={{ theme: 'sidePadding' }}>
                    <div className={styles.transactionTypeSelectContainer}>
                      <Select
                        options={transactionOptions}
                        label={MSG.transactionLabel}
                        name={`transactions.${index}.transactionType`}
                        appearance={{ theme: 'grey', width: 'fluid' }}
                        placeholder={MSG.transactionPlaceholder}
                        disabled={!userHasPermission || isSubmitting}
                      />
                    </div>
                  </DialogSection>
                  {values.transactions[index]?.transactionType ===
                    TransactionTypes.TRANSFER_FUNDS && (
                    <TransferFundsSection
                      colony={colony}
                      disabledInput={!userHasPermission || isSubmitting}
                      values={values}
                      transactionFormIndex={index}
                      setFieldValue={setFieldValue}
                    />
                  )}
                  {values.transactions[index]?.transactionType ===
                    TransactionTypes.RAW_TRANSACTION && (
                    <RawTransactionSection
                      colony={colony}
                      disabledInput={!userHasPermission || isSubmitting}
                      transactionFormIndex={index}
                    />
                  )}
                  {values.transactions[index]?.transactionType ===
                    TransactionTypes.CONTRACT_INTERACTION && (
                    <ContractInteractionSection
                      disabledInput={!userHasPermission || isSubmitting}
                      transactionFormIndex={index}
                    />
                  )}
                </div>
              </div>
            ))}
            <DialogSection>
              <div className={styles.addTransaction}>
                <AddItemButton
                  text={MSG.buttonTransaction}
                  disabled={isSubmitting || !isValid}
                  handleClick={() => handleNewTab(arrayHelpers)}
                />
              </div>
            </DialogSection>
          </>
        )}
      />
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => setShowPreview(!showPreview)}
          // onClick={() => handleSubmit()}
          text={MSG.buttonCreateTransaction}
          // loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  ) : (
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
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={() => setShowPreview(!showPreview)}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

GnosisControlSafeForm.displayName = displayName;

export default GnosisControlSafeForm;
