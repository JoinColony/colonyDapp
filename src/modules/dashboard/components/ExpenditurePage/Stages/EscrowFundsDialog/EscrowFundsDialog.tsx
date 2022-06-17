import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, Annotations, FormSection, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import styles from './EscrowFundsDialog.css';
import DomainDropdown from '~core/DomainDropdown';
import useEscrowFundsDialog from './useEscrowFundsDialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import Dropdown from '~core/UserPickerWithSearch/Dropdown';
import { SpinnerLoader } from '~core/Preloaders';
import ForceActionToggle from '~core/ForceActionToggle/ForceActionToggle';
import { ActionTypes } from '~redux/actionTypes';
import { FormValues } from '~dashboard/CreateColonyWizard/CreateColonyCardRow';
// Mock Data for Staking token, needs to be replaced with native token.

const MSG = defineMessages({
  title: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.title',
    defaultMessage: 'Create a motion to fund expenditure',
  },
  creationTarget: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.creationTarget',
    defaultMessage: 'Motion will be created in',
  },
  force: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.force',
    defaultMessage: 'Force',
  },
  descriptionText: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.descriptionText',
    defaultMessage: `To create this expenditure you need to get 
    collective approval first. To do so create a motion. 
    It is like asking your teammates if they agree to fund your expenditure.
    `,
  },
  allocationHeader: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.allocationHeader',
    defaultMessage: 'Allocation and resources',
  },
  allocationTeam: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.allocationTeam',
    defaultMessage: 'Team',
  },
  allocationBalance: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.allocationTeam',
    defaultMessage: 'Balance',
  },
  fundsHeader: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.fundsHeader',
    defaultMessage: 'Required funds',
  },
  textareaLabel: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.textareaLabel',
    defaultMessage: `Explain why you're creating expanditure`,
  },
  confirmText: {
    id: 'dashboard.Expenditures.Stages.escrowFundsDialog.confirmText',
    defaultMessage: 'Create motion',
  },
});

interface Props {
  cancel: VoidFunction;
  close: VoidFunction;
  onClick: VoidFunction;
  /*
   * To retrieve teams and tokens
   */
  colonyName: string;
}

const EscrowFundsDialog = ({ cancel, onClick, close, colonyName }: Props) => {
  /*
   * Hook to distinct the logic from render
   */
  const {
    colonyData,
    renderActiveOption,
    filterDomains,
    balanceOptions,
    requiredFunds,
    handleMotionDomainChange,
    domainID,
    loading,
    sectionRowRef,
  } = useEscrowFundsDialog(colonyName);

  const handleSubmit = useCallback(() => {
    onClick();
    close();
  }, [onClick, close]);
  return (
    <Dialog cancel={cancel}>
      <ActionForm
        // @TODO these action types are for mocking purposes, change to correct ones
        submit={ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT}
        success={ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS}
        error={ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR}
        initialValues={{ force: false }}
        onSubmit={handleSubmit}
      >
        {(formValues: FormikProps<FormValues>) => (
          <>
            <div className={styles.dialogContainer}>
              <DialogSection appearance={{ theme: 'heading' }}>
                <FormSection>
                  {loading ? (
                    <SpinnerLoader />
                  ) : (
                    colonyData && (
                      <MotionDomainSelect
                        colony={colonyData.processedColony}
                        onDomainChange={handleMotionDomainChange}
                        initialSelectedDomain={domainID}
                        {...formValues}
                      />
                    )
                  )}
                </FormSection>
                <ForceActionToggle />
              </DialogSection>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                className={styles.title}
              >
                <FormattedMessage {...MSG.title} />
              </Heading>
              <DialogSection>
                <div className={styles.description}>
                  <FormattedMessage {...MSG.descriptionText} />
                </div>
              </DialogSection>
              <DialogSection appearance={{ border: 'bottom' }}>
                <Heading
                  appearance={{
                    size: 'small',
                    weight: 'bold',
                    theme: 'dark',
                    margin: 'small',
                  }}
                >
                  <FormattedMessage {...MSG.allocationHeader} />
                </Heading>
                <FormSection appearance={{ border: 'top' }}>
                  <div ref={sectionRowRef} className={styles.sectionRow}>
                    <Dropdown element={sectionRowRef.current} placement="exact">
                      <div className={styles.sectionRow}>
                        <InputLabel
                          label={MSG.allocationTeam}
                          appearance={{
                            direction: 'horizontal',
                          }}
                        />

                        {loading ? (
                          <SpinnerLoader />
                        ) : (
                          colonyData && (
                            <DomainDropdown
                              colony={colonyData.processedColony}
                              name="filteredDomainId"
                              renderActiveOptionFn={renderActiveOption}
                              filterOptionsFn={filterDomains}
                              showAllDomains
                              showDescription
                              dataTest="colonyDomainSelector"
                              itemDataTest="colonyDomainSelectorItem"
                            />
                          )
                        )}
                      </div>
                    </Dropdown>
                  </div>
                </FormSection>
                <FormSection appearance={{ border: 'top' }}>
                  <div className={styles.sectionRow}>
                    <InputLabel
                      label={MSG.allocationBalance}
                      appearance={{
                        direction: 'horizontal',
                      }}
                    />
                    <div>
                      {balanceOptions.map((balanceOption) => {
                        return (
                          <div key={balanceOption.value}>
                            {balanceOption.children}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </FormSection>
              </DialogSection>
              <DialogSection appearance={{ border: 'bottom' }}>
                <Heading
                  appearance={{
                    size: 'small',
                    weight: 'bold',
                    theme: 'dark',
                    margin: 'small',
                  }}
                >
                  <div className={styles.requiredFundsHeader}>
                    <FormattedMessage {...MSG.fundsHeader} />
                  </div>
                </Heading>
                {requiredFunds.map((balanceOption) => {
                  return (
                    <span key={balanceOption.value}>
                      {balanceOption.children}
                    </span>
                  );
                })}
              </DialogSection>
              <DialogSection>
                <div className={styles.annotations}>
                  <Annotations
                    label={MSG.textareaLabel}
                    name="annotationMessage"
                  />
                </div>
              </DialogSection>
            </div>
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                appearance={{
                  theme: 'primary',
                  size: 'large',
                }}
                autoFocus
                onClick={handleSubmit}
                text={MSG.confirmText}
                data-test="confirmButton"
              />
            </DialogSection>
          </>
        )}
      </ActionForm>
    </Dialog>
  );
};

export default EscrowFundsDialog;
