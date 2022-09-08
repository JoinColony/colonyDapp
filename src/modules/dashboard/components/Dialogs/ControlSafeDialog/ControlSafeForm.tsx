import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import classnames from 'classnames';
import { nanoid } from 'nanoid';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import { Select } from '~core/Fields';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import Button, { AddItemButton } from '~core/Button';
import Icon from '~core/Icon';
import { SingleSafePicker, filterUserSelection } from '~core/SingleUserPicker';
import IconTooltip from '~core/IconTooltip';

import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { SAFE_INTEGRATION_LEARN_MORE } from '~externalUrls';
import { Colony, ColonySafe, useLoggedInUser } from '~data/index';
import { Address, PrimitiveType } from '~types/index';

import SafeTransactionPreview from './SafeTransactionPreview';
import { FormValues } from './ControlSafeDialog';
import {
  TransferNFTSection,
  TransferFundsSection,
  RawTransactionSection,
  ContractInteractionSection,
} from './TransactionTypesSection';
import { TransactionTypes, transactionOptions } from './constants';

import styles from './ControlSafeForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.title',
    defaultMessage: 'Control Safe',
  },
  description: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.description',
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.selectSafe',
    defaultMessage: 'Select Safe',
  },
  safePickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.safePickerPlaceholder`,
    defaultMessage: 'Select Safe to control',
  },
  transactionLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.transactionLabel`,
    defaultMessage: 'Select transaction type',
  },
  transactionPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.transactionPlaceholder`,
    defaultMessage: 'Select transaction',
  },
  buttonTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.buttonTransaction`,
    defaultMessage: 'Add another transaction',
  },
  buttonCreateTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.buttonCreateTransaction`,
    defaultMessage: 'Create transaction',
  },
  buttonConfirm: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.buttonConfirm`,
    defaultMessage: 'Confirm',
  },
  transactionTitle: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.transactionTitle`,
    defaultMessage: `Transaction #{transactionNumber} {transactionType, select, undefined {} other {({transactionType})}}`,
  },
  toggleTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} false {Close}} transaction',
  },
  deleteTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.deleteTransaction`,
    defaultMessage: 'Delete transaction',
  },
  deleteTransactionTooltipText: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.deleteTransactionTooltipText`,
    defaultMessage: `Delete transaction.\nBe careful, data can be lost.`,
  },
});

const displayName = 'dashboard.ControlSafeDialog.ControlSafeForm';

// @TODO - figure out the mapping of the nftCatalogue to the safe
export interface NFT {
  name: string;
  avatar: string;
  address: Address;
  tokenID: string;
  safeID: string; // @TODO check this property - perhaps should be moved
}

// Test data for dev - should be obtained from the safe
const testNFTData: NFT[] = [
  {
    name: 'BoredApeYachtClub',
    avatar: 'bla',
    address: '0xb97D57F4959eAfA0339424b83FcFaf9c15407461',
    tokenID: '45161',
    safeID: '9995',
  },
  {
    name: 'NFT 2',
    avatar: 'doh',
    address: '0xb17D57F4959eAfA0339424b83FcFaf9c15407462',
    tokenID: '45161',
    safeID: '9996',
  },
];

interface Props {
  colony: Colony;
  safes: ColonySafe[];
  isVotingExtensionEnabled: boolean;
  back?: () => void;
  showPreview: boolean;
  handleShowPreview: (showPreview: boolean) => void;
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

const ControlSafeForm = ({
  colony,
  colony: { colonyAddress },
  back,
  handleSubmit,
  safes,
  isSubmitting,
  isValid,
  values,
  isVotingExtensionEnabled,
  setFieldValue,
  showPreview,
  handleShowPreview,
  validateForm,
}: Props & FormikProps<FormValues>) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const [hasTitle, setHasTitle] = useState(true);

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
        nft: null,
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

  /* This is necessary as the form validation doesn't work on the first render
  when we switch to showing preview */
  useEffect(() => {
    if (showPreview && values.transactionsTitle === undefined) {
      setHasTitle(false);
    } else {
      setHasTitle(true);
    }
  }, [values, showPreview]);

  useEffect(() => {
    if (!showPreview) {
      validateForm();
    }
  }, [showPreview, validateForm]);

  return (
    <>
      {!showPreview ? (
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
                  <ExternalLink href={SAFE_INTEGRATION_LEARN_MORE}>
                    {chunks}
                  </ExternalLink>
                ),
              }}
            />
          </DialogSection>
          <DialogSection>
            <div className={styles.safePicker}>
              <SingleSafePicker
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
                              /* Need casting as `formatValues` func used in Heading
                            doesn't have correct types (coming from react-intl) */
                            ) as PrimitiveType,
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
                      {values.transactions[index]?.transactionType ===
                        TransactionTypes.TRANSFER_NFT && (
                        <TransferNFTSection
                          colonyAddress={colonyAddress}
                          nftCatalogue={testNFTData}
                          transactionFormIndex={index}
                          values={values}
                          disabledInput={!userHasPermission || isSubmitting}
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
        </>
      ) : (
        <SafeTransactionPreview values={values} colony={colony} />
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={showPreview ? () => handleShowPreview(!showPreview) : back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() =>
            showPreview ? handleSubmit() : handleShowPreview(!showPreview)
          }
          text={showPreview ? MSG.buttonConfirm : MSG.buttonCreateTransaction}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting || !hasTitle}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ControlSafeForm.displayName = displayName;

export default ControlSafeForm;
