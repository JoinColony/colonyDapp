import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import { nanoid } from 'nanoid';
import { isEmpty } from 'lodash';

import { Annotations, FormSection, Toggle } from '~core/Fields';
import { DialogSection } from '~core/Dialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/IncorporationPage/types';

import { FormValuesType } from './EditIncorporationDialog';
import ChangedValues from './ChangedValues';
import ChangedMultipleUsers from './ChangedMultipleUsers';
import styles from './EditIncorporationDialogForm.css';

export const MSG = defineMessages({
  header: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.header`,
    defaultMessage: 'Create a Motion to change application',
  },
  descriptionText: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.descriptionText`,
    defaultMessage: `You are proposing a change to the corporation details, this requires collective approval via a Motion.`,
  },
  descriptionLabel: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.descriptionLabel`,
    defaultMessage: `Explain why you're changing the application (optional)`,
  },
  cancelText: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.cancelText`,
    defaultMessage: 'Back',
  },
  confirmText: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.confirmText`,
    defaultMessage: 'Create Motion',
  },
  ownerConfirmText: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.ownerConfirmText`,
    defaultMessage: 'Confirm',
  },
  noChanges: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.noChanges`,
    defaultMessage: 'No values have been changed!',
  },
  from: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.ChangedValues.from`,
    defaultMessage: '1. Application changes',
  },
  to: {
    id: `dashboard.EditIncorporationDialog.EditIncorporationDialogForm.ChangedValues.to`,
    defaultMessage: 'Change to',
  },
  discard: {
    id: 'dashboard.EditIncorporationDialog.EditIncorporationDialogForm.discard',
    defaultMessage: 'Discard',
  },
});

const displayName = `dashboard.EditIncorporationDialog.EditIncorporationDialogForm`;

interface Props {
  close: () => void;
  colony: Colony;
  confirmedValues?: Partial<ValuesType>;
  oldValues: ValuesType;
  discardChange: VoidFunction;
  onSubmitClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
  isVotingExtensionEnabled: boolean;
  isOwner: boolean;
}

const EditIncorporationDialogForm = ({
  close,
  colony,
  confirmedValues,
  oldValues,
  discardChange,
  onSubmitClick,
  isVotingExtensionEnabled,
  isOwner,
  isSubmitting,
  handleSubmit,
  values,
}: Props & FormikProps<FormValuesType>) => {
  const noChanges =
    (confirmedValues && isEmpty(confirmedValues)) ||
    (confirmedValues &&
      Object.values(confirmedValues).every((value) => !value));

  const confirmedValuesWithIds = useMemo(() => {
    if (!confirmedValues || isEmpty(confirmedValues)) {
      return [];
    }

    return Object.entries(confirmedValues).map(([key, value]) => {
      return {
        key,
        value,
        id: nanoid(),
      };
    });
  }, [confirmedValues]);

  const newData = useMemo(() => {
    const newValues = confirmedValuesWithIds.filter(
      (newValue) => !Array.isArray(newValue.value),
    );
    const newMultiple = confirmedValuesWithIds.filter((newValue) => {
      return Array.isArray(newValue.value);
    });

    return {
      newValues,
      newMultiple,
    };
  }, [confirmedValuesWithIds]);

  return (
    <>
      <DialogSection>
        {!isOwner && (
          <div className={classNames(styles.withoutPadding, styles.forceRow)}>
            <MotionDomainSelect colony={colony} disabled={noChanges} />
            {isVotingExtensionEnabled && (
              <div className={styles.toggleContainer}>
                <Toggle
                  label={{ id: 'label.force' }}
                  name="forceAction"
                  appearance={{ theme: 'danger' }}
                  disabled={isSubmitting || noChanges}
                  tooltipText={{ id: 'tooltip.forceAction' }}
                  tooltipPopperOptions={{
                    placement: 'top-end',
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [4, 6],
                        },
                      },
                    ],
                    strategy: 'fixed',
                  }}
                />
              </div>
            )}
          </div>
        )}
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.header} />
        </Heading>
        <div className={styles.descriptionWrapper}>
          <FormattedMessage {...MSG.descriptionText} />
        </div>
      </DialogSection>
      <div className={styles.contentWrapper}>
        {!confirmedValues || noChanges ? (
          <div className={styles.noChanges}>
            <FormattedMessage {...MSG.noChanges} />
          </div>
        ) : (
          <>
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.subheader}>
                <span>
                  <FormattedMessage {...MSG.from} />
                </span>
                <span>
                  <FormattedMessage {...MSG.to} />
                </span>
              </div>
            </FormSection>
            <ChangedValues
              newValues={newData.newValues}
              oldValues={oldValues}
            />
            <ChangedMultipleUsers
              newValues={newData.newMultiple}
              oldValues={oldValues}
              colony={colony}
            />
            <div className={styles.buttonWrappper}>
              <Button
                className={styles.discard}
                onClick={() => {
                  discardChange();
                }}
                text={MSG.discard}
              />
            </div>
          </>
        )}
      </div>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotationsWrapper}>
          <Annotations
            label={MSG.descriptionLabel}
            name="annotationMessage"
            maxLength={90}
            disabled={noChanges}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={MSG.cancelText}
          onClick={close}
        />
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          autoFocus
          text={isOwner ? MSG.ownerConfirmText : MSG.confirmText}
          onClick={(e) => {
            handleSubmit(e as any);
            onSubmitClick(confirmedValues, values.forceAction);
            close();
          }}
          disabled={noChanges}
        />
      </DialogSection>
    </>
  );
};

EditIncorporationDialogForm.displayName = displayName;

export default EditIncorporationDialogForm;
