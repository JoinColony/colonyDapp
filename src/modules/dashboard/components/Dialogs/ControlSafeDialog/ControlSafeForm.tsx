import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import {
  VotingReputationExtensionVersion,
  ColonyVersion,
} from '@colony/colony-js';
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

import { SAFE_INTEGRATION_LEARN_MORE } from '~externalUrls';
import {
  Colony,
  ColonySafe,
  SafeTransaction,
  useLoggedInUser,
} from '~data/index';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { PrimitiveType } from '~types/index';
import { SelectedSafe } from '~modules/dashboard/sagas/utils/safeHelpers';
import { debounce, isEmpty, isEqual, omit } from '~utils/lodash';
import { hasRoot } from '~modules/users/checks';
import { getAllUserRoles } from '~modules/transformers';
import { useTransformer } from '~utils/hooks';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import SafeTransactionPreview from './SafeTransactionPreview';
import {
  defaultTransaction,
  FormValues,
  UpdatedMethods,
} from './ControlSafeDialog';
import {
  TransferNFTSection,
  TransferFundsSection,
  RawTransactionSection,
  ContractInteractionSection,
  ErrorMessage,
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
  invalidSafeError: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.invalidSafeError`,
    defaultMessage:
      'Select a safe from the menu or add a new one via Safe Control',
  },
  warningIconTitle: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.warningIconTitle',
    defaultMessage: `Warning!`,
  },
  upgradeWarning: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.upgradeWarning',
    defaultMessage: `Controlling a Safe is not supported on your current Colony version. Please upgrade Colony to at least version 12.{break}You can do this via <span>New Action > Advanced > Upgrade</span>`,
  },
});

export const { invalidSafeError } = MSG;
const displayName = 'dashboard.ControlSafeDialog.ControlSafeForm';

export interface FormProps {
  colony: Colony;
  safes: ColonySafe[];
  back?: () => void;
  showPreview: boolean;
  setShowPreview: (showPreview: boolean) => void;
  selectedContractMethods?: UpdatedMethods;
  setSelectedContractMethods: React.Dispatch<
    React.SetStateAction<UpdatedMethods>
  >;
  isVotingExtensionEnabled: boolean;
  votingExtensionVersion: number | null;
}

export interface TransactionSectionProps extends Pick<FormProps, 'colony'> {
  disabledInput: boolean;
  transactionFormIndex: number;
  handleInputChange: () => void;
  handleValidation: () => void;
}

enum ContractFunctions {
  TRANSFER_FUNDS = 'transfer',
  TRANSFER_NFT = 'safeTransferFrom',
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
  colony: { colonyAddress, version },
  back,
  handleSubmit,
  safes,
  isSubmitting,
  isValid,
  values,
  setFieldValue,
  showPreview,
  setShowPreview,
  validateForm,
  dirty,
  selectedContractMethods,
  setFieldTouched,
  setSelectedContractMethods,
  isVotingExtensionEnabled,
  votingExtensionVersion,
}: FormProps & FormikProps<FormValues>) => {
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const [prevSafeAddress, setPrevSafeAddress] = useState<string>('');
  const { walletAddress } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const canManageAndControlSafes = hasRoot(allUserRoles);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canManageAndControlSafes,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const handleValidation = useCallback(() => {
    // setTimeout ensures form state is latest. Related: https://github.com/jaredpalmer/formik/issues/529
    setTimeout(validateForm, 0);
  }, [validateForm]);

  const handleSelectedContractMethods = useCallback(
    (contractMethods: UpdatedMethods, index: number) => {
      // eslint-disable-next-line max-len
      const functionParamTypes: SafeTransaction['functionParamTypes'] = contractMethods[
        index
      ]?.inputs?.map((input) => ({
        name: input.name,
        type: input.type,
      }));

      setSelectedContractMethods(contractMethods);
      setFieldValue(
        `transactions.${index}.functionParamTypes`,
        functionParamTypes,
      );
    },
    [setFieldValue, setSelectedContractMethods],
  );

  const handleTabRemoval = useCallback(
    (
      arrayHelpers: FieldArrayRenderProps,
      index: number,
      contractMethods?: UpdatedMethods,
    ) => {
      arrayHelpers.remove(index);

      const shiftedContractMethods = contractMethods
        ? Object.keys(contractMethods).reduce((acc, contractMethodIndex) => {
            if (index < Number(contractMethodIndex)) {
              return {
                ...acc,
                [Number(contractMethodIndex) - 1]: contractMethods[
                  contractMethodIndex
                ],
              };
            }
            return {
              ...acc,
              [contractMethodIndex]: contractMethods[contractMethodIndex],
            };
          }, {})
        : {};
      handleSelectedContractMethods(shiftedContractMethods, index);

      const newTransactionTabStatus = [...transactionTabStatus];
      newTransactionTabStatus.splice(index, 1);
      setTransactionTabStatus(newTransactionTabStatus);
      handleValidation();
    },
    [
      transactionTabStatus,
      setTransactionTabStatus,
      handleValidation,
      handleSelectedContractMethods,
    ],
  );
  const handleNewTab = useCallback(
    (arrayHelpers: FieldArrayRenderProps) => {
      arrayHelpers.push(defaultTransaction);
      setTransactionTabStatus([
        ...Array(transactionTabStatus.length).fill(false),
        true,
      ]);
      handleValidation();
    },
    [setTransactionTabStatus, transactionTabStatus, handleValidation],
  );

  const handleTabToggle = useCallback(
    (newIndex: number) => {
      const newTransactionTabs = transactionTabStatus.map((tab, index) =>
        index === newIndex ? !tab : tab,
      );
      setTransactionTabStatus(newTransactionTabs);
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
          setFieldValue(`transactions.${i}.nftData`, null);
        }
      });
    }
  };

  const handleShowPreview = (isPreview: boolean) => {
    setShowPreview(!isPreview);
    handleValidation();
  };

  const removeSelectedContractMethod = useCallback(
    (transactionFormIndex: number) => {
      const updatedSelectedContractMethods = omit(
        selectedContractMethods,
        transactionFormIndex,
      );

      if (!isEqual(updatedSelectedContractMethods, selectedContractMethods)) {
        handleSelectedContractMethods(
          updatedSelectedContractMethods,
          transactionFormIndex,
        );
        setFieldValue(
          `transactions.${transactionFormIndex}.contractFunction`,
          '',
          true,
        );
      }
    },
    [selectedContractMethods, handleSelectedContractMethods, setFieldValue],
  );

  const handleTransactionTypeChange = (type: string, index: number) => {
    const setContractFunction = (contractFunction: string) =>
      setFieldValue(
        `transactions.${index}.contractFunction`,
        contractFunction,
        true,
      );
    switch (type) {
      case TransactionTypes.TRANSFER_FUNDS:
        setContractFunction(ContractFunctions.TRANSFER_FUNDS);
        break;
      case TransactionTypes.TRANSFER_NFT:
        setContractFunction(ContractFunctions.TRANSFER_NFT);
        break;
      default:
        setContractFunction('');
        break;
    }
  };

  const submitButtonText = (() => {
    if (!showPreview) {
      return MSG.buttonCreateTransaction;
    }
    return { id: 'button.confirm' };
  })();

  const savedNFTState = useState({});
  const savedTokenState = useState({});
  const isSupportedColonyVersion =
    parseInt(version, 10) >= ColonyVersion.GreenLightweightSpaceshipThree;
  const disabledInputs =
    !userHasPermission || isSubmitting || !isSupportedColonyVersion;

  const renderTransactionSection = (
    transaction: SafeTransaction,
    index: number,
  ) => {
    const { transactionType } = transaction;
    switch (transactionType) {
      case TransactionTypes.TRANSFER_FUNDS:
        return (
          <TransferFundsSection
            colony={colony}
            disabledInput={disabledInputs}
            values={values}
            transactionFormIndex={index}
            setFieldValue={setFieldValue}
            handleInputChange={handleInputChange}
            handleValidation={handleValidation}
            setFieldTouched={setFieldTouched}
            savedTokenState={savedTokenState}
          />
        );
      case TransactionTypes.RAW_TRANSACTION:
        return (
          <RawTransactionSection
            colony={colony}
            disabledInput={disabledInputs}
            transactionFormIndex={index}
            handleInputChange={handleInputChange}
            handleValidation={handleValidation}
          />
        );
      case TransactionTypes.CONTRACT_INTERACTION:
        return (
          <ContractInteractionSection
            disabledInput={disabledInputs}
            transactionFormIndex={index}
            values={values}
            safes={safes}
            setFieldValue={setFieldValue}
            selectedContractMethods={selectedContractMethods}
            handleSelectedContractMethods={handleSelectedContractMethods}
            handleValidation={handleValidation}
            handleInputChange={handleInputChange}
            removeSelectedContractMethod={removeSelectedContractMethod}
            isValid={isValid}
          />
        );
      case TransactionTypes.TRANSFER_NFT:
        return (
          <TransferNFTSection
            colonyAddress={colonyAddress}
            transactionFormIndex={index}
            values={values}
            disabledInput={disabledInputs}
            savedNFTState={savedNFTState}
            handleValidation={handleValidation}
          />
        );
      default:
        return null;
    }
  };

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
          {!isSupportedColonyVersion && (
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.upgradeWarning}>
                <Icon
                  name="triangle-warning"
                  className={styles.warningIcon}
                  title={MSG.warningIconTitle}
                />
                <div>
                  <FormattedMessage
                    {...MSG.upgradeWarning}
                    values={{
                      span: (chunks) => (
                        <span className={styles.upgradePath}>{chunks}</span>
                      ),
                      break: <br />,
                    }}
                  />
                </div>
              </div>
            </DialogSection>
          )}
          <DialogSection>
            <div className={styles.safePicker}>
              <SingleSafePicker
                label={MSG.selectSafe}
                name="safe"
                filter={filterUserSelection}
                renderAvatar={renderAvatar}
                data={safes}
                showMaskedAddress
                disabled={disabledInputs}
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
                {values.transactions.map((transaction, index, transactions) => (
                  <div key={autogeneratedIds[index]}>
                    {transactions.length > 1 && (
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
                          onClick={() =>
                            handleTabRemoval(
                              arrayHelpers,
                              index,
                              selectedContractMethods,
                            )
                          }
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
                          transactions.length > 1 &&
                          !transactionTabStatus[index],
                      })}
                    >
                      <DialogSection appearance={{ theme: 'sidePadding' }}>
                        <div className={styles.transactionTypeSelectContainer}>
                          <Select
                            options={transactionOptions}
                            label={MSG.transactionLabel}
                            name={`transactions.${index}.transactionType`}
                            onChange={(type) => {
                              removeSelectedContractMethod(index);
                              handleTransactionTypeChange(type, index);
                            }}
                            appearance={{ theme: 'grey', width: 'fluid' }}
                            placeholder={MSG.transactionPlaceholder}
                            disabled={disabledInputs}
                            validateOnChange
                          />
                        </div>
                      </DialogSection>
                      {isEmpty(values.safe) && dirty ? (
                        <ErrorMessage error={MSG.invalidSafeError} />
                      ) : (
                        renderTransactionSection(transaction, index)
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
          colony={colony}
          isSubmitting={isSubmitting}
          values={values}
          selectedContractMethods={selectedContractMethods}
          isVotingExtensionEnabled={isVotingExtensionEnabled}
          canManageAndControlSafes={canManageAndControlSafes}
          onlyForceAction={onlyForceAction}
          handleValidation={handleValidation}
          setFieldValue={setFieldValue}
        />
      )}
      {onlyForceAction && (!canManageAndControlSafes || showPreview) && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          includeForceCopy={showPreview}
        />
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        {(back || showPreview) && (
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={showPreview ? () => handleShowPreview(showPreview) : back}
            text={{ id: 'button.back' }}
          />
        )}
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() =>
            showPreview ? handleSubmit() : handleShowPreview(showPreview)
          }
          text={submitButtonText}
          loading={isSubmitting}
          disabled={
            !isValid ||
            isSubmitting ||
            !dirty ||
            (showPreview &&
              votingExtensionVersion ===
                // eslint-disable-next-line max-len
                VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
              !values.forceAction)
          }
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ControlSafeForm.displayName = displayName;

export default ControlSafeForm;
