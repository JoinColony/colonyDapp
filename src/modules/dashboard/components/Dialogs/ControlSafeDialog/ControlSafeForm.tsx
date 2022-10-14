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
import { PrimitiveType } from '~types/index';
import { SelectedSafe } from '~modules/dashboard/sagas/utils/safeHelpers';
import { debounce, isEqual, omit } from '~utils/lodash';

import SafeTransactionPreview from './SafeTransactionPreview';
import { FormValues, UpdatedMethods } from './ControlSafeDialog';
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

export interface FormProps {
  colony: Colony;
  safes: ColonySafe[];
  isVotingExtensionEnabled: boolean;
  back?: () => void;
  showPreview: boolean;
  handleShowPreview: (showPreview: boolean) => void;
  selectedContractMethods?: UpdatedMethods;
  handleSelectedContractMethods: React.Dispatch<
    React.SetStateAction<UpdatedMethods>
  >;
}

export interface TransactionSectionProps extends Pick<FormProps, 'colony'> {
  disabledInput: boolean;
  transactionFormIndex: number;
  handleInputChange: () => void;
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
  dirty,
  selectedContractMethods,
  setFieldTouched,
  handleSelectedContractMethods,
}: FormProps & FormikProps<FormValues>) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const [hasTitle, setHasTitle] = useState(true);
  const [prevSafeAddress, setPrevSafeAddress] = useState<string>('');

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

  const handleValidation = useCallback(() => {
    // setTimeout ensures form state is latest. Related: https://github.com/jaredpalmer/formik/issues/529
    setTimeout(validateForm, 0);
  }, [validateForm]);

  const handleTabRemoval = useCallback(
    (arrayHelpers: FieldArrayRenderProps, index: number) => {
      arrayHelpers.remove(index);
      const newTransactionTabStatus = [...transactionTabStatus];
      newTransactionTabStatus.splice(index, 1);
      setTransactionTabStatus(newTransactionTabStatus);
      handleValidation();
    },
    [transactionTabStatus, setTransactionTabStatus, handleValidation],
  );
  const handleNewTab = useCallback(
    (arrayHelpers: FieldArrayRenderProps) => {
      arrayHelpers.push({
        transactionType: '',
        tokenAddress: colony.nativeTokenAddress,
        amount: undefined,
        recipient: null,
        data: '',
        contract: null,
        abi: '',
        contractFunction: '',
        nft: null,
      });
      setTransactionTabStatus([
        ...Array(transactionTabStatus.length).fill(false),
        true,
      ]);
      handleValidation();
    },
    [
      colony.nativeTokenAddress,
      setTransactionTabStatus,
      transactionTabStatus,
      handleValidation,
    ],
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
        <FormattedMessage {...transactionType.label} key={nanoid()} />
      ) : null;
    },
    [],
  );
  const autogeneratedIds = useMemo(
    () => [...new Array(values.transactions.length)].map(nanoid),
    [values.transactions.length],
  );

  const handleInputChange = useCallback(
    // debounce ensures ui doesn't lag when entering input quickly, e.g. by holding down a single key.
    debounce(handleValidation, 300),
    [],
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

  /*
   * When the selected safe changes, reset the state of
   * the "Transfer NFT" fields.
   */
  const handleSafeChange = (selectedSafe: SelectedSafe) => {
    const safeAddress = selectedSafe.profile.walletAddress;
    if (safeAddress !== prevSafeAddress) {
      setPrevSafeAddress(safeAddress);
      values.transactions.forEach((tx, i) => {
        if (tx.transactionType === TransactionTypes.TRANSFER_NFT) {
          setFieldValue(`transactions.${i}.nft`, null);
        }
      });
    }
  };

  const removeSelectedContractMethod = useCallback(
    (transactionFormIndex: number) => {
      const updatedSelectedContractMethods = omit(
        selectedContractMethods,
        transactionFormIndex,
      );

      if (!isEqual(updatedSelectedContractMethods, selectedContractMethods)) {
        handleSelectedContractMethods(updatedSelectedContractMethods);
        setFieldValue(
          `transactions.${transactionFormIndex}.contractFunction`,
          '',
          true,
        );
      }
    },
    [selectedContractMethods, handleSelectedContractMethods, setFieldValue],
  );

  const savedNFTState = useState({});
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
                onSelected={handleSafeChange}
                validateOnChange
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
                            onChange={() => removeSelectedContractMethod(index)}
                            appearance={{ theme: 'grey', width: 'fluid' }}
                            placeholder={MSG.transactionPlaceholder}
                            disabled={!userHasPermission || isSubmitting}
                            validateOnChange
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
                          handleInputChange={handleInputChange}
                          handleValidation={handleValidation}
                          setFieldTouched={setFieldTouched}
                        />
                      )}
                      {values.transactions[index]?.transactionType ===
                        TransactionTypes.RAW_TRANSACTION && (
                        <RawTransactionSection
                          colony={colony}
                          disabledInput={!userHasPermission || isSubmitting}
                          transactionFormIndex={index}
                          handleInputChange={handleInputChange}
                          handleValidation={handleValidation}
                        />
                      )}
                      {values.transactions[index]?.transactionType ===
                        TransactionTypes.CONTRACT_INTERACTION && (
                        <ContractInteractionSection
                          disabledInput={!userHasPermission || isSubmitting}
                          transactionFormIndex={index}
                          values={values}
                          safes={safes}
                          setFieldValue={setFieldValue}
                          selectedContractMethods={selectedContractMethods}
                          handleSelectedContractMethods={
                            handleSelectedContractMethods
                          }
                          handleValidation={handleValidation}
                          handleInputChange={handleInputChange}
                          removeSelectedContractMethod={
                            removeSelectedContractMethod
                          }
                        />
                      )}
                      {values.transactions[index]?.transactionType ===
                        TransactionTypes.TRANSFER_NFT && (
                        <TransferNFTSection
                          colonyAddress={colonyAddress}
                          transactionFormIndex={index}
                          values={values}
                          disabledInput={!userHasPermission || isSubmitting}
                          savedNFTState={savedNFTState}
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
        <SafeTransactionPreview
          values={values}
          selectedContractMethods={selectedContractMethods}
        />
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
          disabled={!isValid || isSubmitting || !hasTitle || !dirty}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ControlSafeForm.displayName = displayName;

export default ControlSafeForm;
