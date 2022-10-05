import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { FormikProps, useField } from 'formik';
import { nanoid } from 'nanoid';
import { isEmpty } from 'lodash';

import { Annotations, Toggle } from '~core/Fields';
import { DialogSection } from '~core/Dialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { Colony } from '~data/index';
import { ExpenditureTypes, ValuesType } from '~pages/ExpenditurePage/types';
import { Recipient as RecipientType } from '~dashboard/ExpenditurePage/Payments/types';
import { EDITING_LOCKED_PAYMENTS } from '~externalUrls';

import { FormValuesType } from './EditExpenditureDialog';
import ChangedValues from './ChangedValues';
import ChangedMultiple from './ChangedMultiple';
import ChangedSplit from './ChangedSplit';
import styles from './EditExpenditureDialogForm.css';

export const MSG = defineMessages({
  header: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  descriptionText: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.descriptionText`,
    defaultMessage: `This Payment is currently Locked. Either a Motion, or a member with the Arbitration permission are required to make changes. <a>Learn more.</a>`,
  },
  descriptionLabel: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.descriptionLabel`,
    defaultMessage: `Explain why you're changing the payment (optional)`,
  },
  cancelText: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.cancelText',
    defaultMessage: 'Back',
  },
  confirmText: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.confirmText',
    defaultMessage: 'Create Motion',
  },
  confirmTexForce: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.confirmTexForce`,
    defaultMessage: 'Force change',
  },
  forceTextareaLabel: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.textareaLabel`,
    defaultMessage: `Explain why you're changing the expenditure`,
  },
  noChanges: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.noChanges',
    defaultMessage: 'No values have been changed!',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm';

interface Props {
  close: () => void;
  colony: Colony;
  confirmedValues?: Partial<ValuesType>;
  oldValues: ValuesType;
  discardRecipientChange: (recipients: Partial<RecipientType>[]) => void;
  discardChange: (name: string) => void;
  onSubmitClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
  isVotingExtensionEnabled: boolean;
}

const EditExpenditureDialogForm = ({
  close,
  colony,
  confirmedValues,
  oldValues,
  discardRecipientChange,
  discardChange,
  onSubmitClick,
  isVotingExtensionEnabled,
  isSubmitting,
  handleSubmit,
  values,
}: Props & FormikProps<FormValuesType>) => {
  const [, { value: recipients }] = useField('recipients');

  useEffect(() => {
    // discarding changes is done with FieldArray helper functions,
    // so if recipients changes, we need to update state by calling discardRecipientChange funciton
    discardRecipientChange(recipients);
  }, [discardRecipientChange, recipients]);

  const noChanges =
    (confirmedValues && isEmpty(confirmedValues)) ||
    (confirmedValues &&
      Object.values(confirmedValues).every((value) => !value));

  const confirmedValuesWithIds = useMemo(() => {
    if (!confirmedValues || isEmpty(confirmedValues)) {
      return [];
    }

    return Object.entries(confirmedValues).map(([key, value]) => ({
      key,
      value,
      id: nanoid(),
    }));
  }, [confirmedValues]);

  const newData = useMemo(() => {
    const [newPayments] = confirmedValuesWithIds.filter(
      (newValue) => newValue.key === ExpenditureTypes.Split,
    );
    const newValues = confirmedValuesWithIds.filter(
      (newValue) => !Array.isArray(newValue.value) && newValue.key !== 'split',
    );
    const newMultiple = confirmedValuesWithIds.filter((newValue) => {
      return Array.isArray(newValue.value);
    });

    return {
      newValues,
      newMultiple,
      newPayments,
    };
  }, [confirmedValuesWithIds]);

  return (
    <>
      <DialogSection>
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
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.header} />
        </Heading>
        <div className={styles.descriptionWrapper}>
          <FormattedMessage
            {...MSG.descriptionText}
            values={{
              a: (chunks) => (
                <a
                  href={EDITING_LOCKED_PAYMENTS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {chunks}
                </a>
              ),
            }}
          />
        </div>
      </DialogSection>
      <div className={styles.contentWrapper}>
        {!confirmedValues || noChanges ? (
          <div className={styles.noChanges}>
            <FormattedMessage {...MSG.noChanges} />
          </div>
        ) : (
          <>
            <ChangedMultiple
              newValues={newData.newMultiple}
              oldValues={oldValues}
              colony={colony}
            />
            <ChangedSplit
              newValues={newData.newPayments}
              oldValues={oldValues}
              colony={colony}
              discardChange={discardChange}
            />
            <ChangedValues
              newValues={newData.newValues}
              oldValues={oldValues}
              colony={colony}
              discardChange={discardChange}
            />
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
            theme: values.forceAction ? 'danger' : 'primary',
            size: 'large',
          }}
          autoFocus
          text={values.forceAction ? MSG.confirmTexForce : MSG.confirmText}
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

EditExpenditureDialogForm.displayName = displayName;

export default EditExpenditureDialogForm;
