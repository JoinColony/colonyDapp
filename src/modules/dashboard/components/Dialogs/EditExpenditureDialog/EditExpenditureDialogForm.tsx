import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { FormikProps, useField } from 'formik';
import { nanoid } from 'nanoid';
import { isEmpty } from 'lodash';

import { Annotations, Toggle } from '~core/Fields';
import { DialogSection } from '~core/Dialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useTransformer } from '~utils/hooks';
import { Colony, useLoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { Recipient as RecipientType } from '~dashboard/ExpenditurePage/Payments/types';

import { FormValuesType } from './EditExpenditureDialog';
import ChangedValues from './ChangedValues';
import ChangedMultiple from './ChangedMultiple';
import styles from './EditExpenditureDialogForm.css';

export const MSG = defineMessages({
  header: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  descriptionText: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.descriptionText`,
    defaultMessage: `This Payment is currently Locked. Either a Motion, or a member with the Arbitration permission are required to make changes.`,
  },
  note: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.note`,
    defaultMessage: `Note: if this variable has previously been voted on, subsequent votes will require more Reputation to be in favour in order for changes to be valid.`,
  },
  descriptionLabel: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogFormdescriptionLabel`,
    defaultMessage: `Explain why you're changing the payment {optional}`,
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
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const [, { value: recipients }] = useField('recipients');
  const { formatMessage } = useIntl();

  useEffect(() => {
    // discarding changes is done with FieldArray helper functions,
    // so if recipients changes, we need to update state by calling discardRecipientChange funciton
    discardRecipientChange(recipients);
  }, [discardRecipientChange, recipients]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelExpenditure = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelExpenditure,
    isVotingExtensionEnabled,
    values.forceAction,
  );
  const noChanges =
    (confirmedValues && isEmpty(confirmedValues)) ||
    (confirmedValues &&
      Object.values(confirmedValues).every((value) => !value));

  const confirmedValuesWithIds = useMemo(() => {
    if (!confirmedValues) {
      return [];
    }

    return Object.entries(confirmedValues).map(([key, value]) => ({
      key,
      value,
      id: nanoid(),
    }));
  }, [confirmedValues]);

  const newData = useMemo(() => {
    const newValues = confirmedValuesWithIds.filter(
      (newValue) => !Array.isArray(newValue.value),
    );
    const newMultiple = confirmedValuesWithIds.filter((newValue) =>
      Array.isArray(newValue.value),
    );

    return {
      newValues,
      newMultiple,
    };
  }, [confirmedValuesWithIds]);

  return (
    <>
      <DialogSection>
        <div className={classNames(styles.withoutPadding, styles.forceRow)}>
          <MotionDomainSelect colony={colony} disabled={noChanges} />
          {canCancelExpenditure && isVotingExtensionEnabled && (
            <div className={styles.toggleContainer}>
              <Toggle
                label={{ id: 'label.force' }}
                name="forceAction"
                appearance={{ theme: 'danger' }}
                disabled={!userHasPermission || isSubmitting || noChanges}
                tooltipText={{ id: 'tooltip.forceAction' }}
                tooltipPopperOptions={{
                  placement: 'top-end',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [-5, 6],
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
          <FormattedMessage {...MSG.descriptionText} />
        </div>
        <div className={styles.noteWrapper}>
          <FormattedMessage {...MSG.note} />
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
            label={formatMessage(MSG.descriptionLabel, {
              optional: !values.forceAction && '(optional)',
            })}
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
