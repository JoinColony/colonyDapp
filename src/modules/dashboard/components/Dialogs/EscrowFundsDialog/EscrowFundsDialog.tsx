import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import classNames from 'classnames';

import Dialog, { DialogSection } from '~core/Dialog';
import {
  ActionForm,
  Annotations,
  FormSection,
  InputLabel,
  Toggle,
} from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import styles from './EscrowFundsDialog.css';
import DomainDropdown from '~core/DomainDropdown';
import useEscrowFundsDialog from './useEscrowFundsDialog';
import { SpinnerLoader } from '~core/Preloaders';
import { ActionTypes } from '~redux/actionTypes';
import { Tooltip } from '~core/Popover';
import Icon from '~core/Icon';

const MSG = defineMessages({
  title: {
    id: 'dashboard.EscrowFundsDialog.title',
    defaultMessage: 'Create a motion to fund expenditure',
  },
  force: {
    id: 'dashboard.EscrowFundsDialog.force',
    defaultMessage: 'Force',
  },
  descriptionText: {
    id: 'dashboard.EscrowFundsDialog.descriptionText',
    defaultMessage: `To create this expenditure you need to get 
    collective approval first. To do so create a motion. 
    It is like asking your teammates if they agree to fund your expenditure.
    `,
  },
  allocationHeader: {
    id: 'dashboard.EscrowFundsDialog.allocationHeader',
    defaultMessage: 'Allocation and resources',
  },
  allocationTeam: {
    id: 'dashboard.EscrowFundsDialog.allocationTeam',
    defaultMessage: 'Team',
  },
  allocationBalance: {
    id: 'dashboard.EscrowFundsDialog.allocationTeam',
    defaultMessage: 'Balance',
  },
  fundsHeader: {
    id: 'dashboard.EscrowFundsDialog.fundsHeader',
    defaultMessage: 'Required funds',
  },
  textareaLabel: {
    id: 'dashboard.EscrowFundsDialog.textareaLabel',
    defaultMessage: `Explain why you're creating expanditure`,
  },
  confirmText: {
    id: 'dashboard.EscrowFundsDialog.confirmText',
    defaultMessage: 'Create motion',
  },
});

const displayName = 'dashboard.EscrowFundsDialog';

interface FormValues {
  force: boolean;
  filteredDomainId: string;
  annotationMessage?: string;
}

interface Props {
  cancel: VoidFunction;
  close: VoidFunction;
  onClick: VoidFunction;
  /*
   * To retrieve teams and tokens
   */
  colonyName: string;
  isVotingExtensionEnabled: boolean;
}

const EscrowFundsDialog = ({
  cancel,
  onClick,
  close,
  colonyName,
  isVotingExtensionEnabled,
}: Props) => {
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
    renderActiveDomainOption,
  } = useEscrowFundsDialog(colonyName);
  const [isForce, setIsForce] = useState(false);

  const handleSubmit = useCallback(() => {
    onClick();
    close();
  }, [onClick, close]);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      // @TODO these action types are for mocking purposes, change to correct ones
      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        submit={getFormAction('SUBMIT')}
        error={getFormAction('ERROR')}
        success={getFormAction('SUCCESS')}
        initialValues={{ force: false }}
        onSubmit={handleSubmit}
      >
        {(formValues: FormikProps<FormValues>) => {
          if (formValues.values.force !== isForce) {
            setIsForce(formValues.values.force);
          }
          return (
            <>
              <div className={styles.dialogContainer}>
                <DialogSection appearance={{ theme: 'heading' }}>
                  {loading ? (
                    <SpinnerLoader />
                  ) : (
                    colonyData && (
                      <div>
                        <DomainDropdown
                          colony={colonyData.processedColony}
                          name="motionDomainId"
                          currentDomainId={domainID}
                          renderActiveOptionFn={renderActiveDomainOption}
                          filterOptionsFn={filterDomains}
                          onDomainChange={handleMotionDomainChange}
                          showAllDomains={false}
                          showDescription={false}
                        />
                      </div>
                    )
                  )}
                  <div className={styles.forceContainer}>
                    <div className={styles.margin}>
                      <Toggle
                        label={{ id: 'label.force' }}
                        name="force"
                        appearance={{ theme: 'danger' }}
                      />
                    </div>
                    <Tooltip
                      content={
                        <div className={styles.tooltip}>
                          <FormattedMessage id="tooltip.forceAction" />
                        </div>
                      }
                      trigger="hover"
                      placement="top-end"
                    >
                      <Icon
                        name="question-mark"
                        className={styles.questionIcon}
                      />
                    </Tooltip>
                  </div>
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
                    <div
                      className={classNames(styles.sectionRow, styles.dropdown)}
                    >
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
                          <span className={styles.teamSelectWrapper}>
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
                          </span>
                        )
                      )}
                    </div>
                  </FormSection>
                  <FormSection appearance={{ border: 'top' }}>
                    <div className={styles.sectionRow} id={styles.balanceRow}>
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
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

EscrowFundsDialog.displayName = displayName;

export default EscrowFundsDialog;
