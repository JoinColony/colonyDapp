import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import { nanoid } from 'nanoid';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Annotations, FormSection, Toggle } from '~core/Fields';
import { DialogSection } from '~core/Dialog';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import Heading from '~core/Heading';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useTransformer } from '~utils/hooks';
import { Colony, useLoggedInUser } from '~data/index';

import { FormValuesType } from './EditExpenditureDialog';
import Recipient from './Recipient';
import styles from './EditExpenditureDialogForm.css';

export const MSG = defineMessages({
  header: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  descriptionText: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogForm.descriptionText`,
    defaultMessage: `Payment is currently at the locked stage.
    Any edits require at this point an action to be made.
    You can either enforce permission,
    or create a motion to get collective approval.`,
  },
  descriptionLabel: {
    id: `dashboard.EditExpenditureDialog.EditExpenditureDialogFormdescriptionLabel`,
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
  change: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.change',
    defaultMessage: 'Change',
  },
  new: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.new',
    defaultMessage: 'New',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.discard',
    defaultMessage: 'Discard',
  },
  teamCaption: {
    id: 'dashboard.EditExpenditureDialog.EditExpenditureDialogForm.teamCaption',
    defaultMessage: 'Team',
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
  confirmedValues: Partial<ValuesType> | undefined;
  oldValues: ValuesType;
  discardRecipientChange: (id: string) => void;
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

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelExpenditure = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelExpenditure,
    isVotingExtensionEnabled,
    values.forceAction,
  );
  const noChanges =
    confirmedValues && Object.keys(confirmedValues).length === 0;

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

  const renderChange = useCallback(
    (change: any, key: string) => {
      switch (key) {
        case 'title': {
          return change || '-';
        }
        case 'description': {
          return change || '-';
        }
        case 'filteredDomainId': {
          const domain = colony?.domains.find(
            ({ ethDomainId }) => Number(change) === ethDomainId,
          );
          const defaultColor =
            change === String(ROOT_DOMAIN_ID) ? Color.LightPink : Color.Yellow;

          const color = domain ? domain.color : defaultColor;
          return (
            <div className={styles.teamWrapper}>
              <ColorTag color={color} />
              {domain?.name}
            </div>
          );
        }
        default:
          return null;
      }
    },
    [colony],
  );

  return (
    <>
      <DialogSection>
        <div
          className={classNames(
            styles.row,
            styles.withoutPadding,
            styles.forceRow,
          )}
        >
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
      </DialogSection>
      <div className={styles.contentWrapper}>
        {!confirmedValues || noChanges ? (
          <div className={styles.noChanges}>
            <FormattedMessage {...MSG.noChanges} />
          </div>
        ) : (
          confirmedValuesWithIds.map(({ key, value, id }) => {
            if (
              Array.isArray(value) &&
              Object.keys(value).length > 0 &&
              key === 'recipients'
            ) {
              return value.map((changedItem, changeIndex) => {
                return (
                  <Recipient
                    key={id}
                    oldValues={oldValues}
                    index={changeIndex}
                    changedItem={changedItem}
                    colony={colony}
                    discardRecipientChange={discardRecipientChange}
                  />
                );
              });
            }
            return (
              <React.Fragment key={id}>
                <FormSection appearance={{ border: 'bottom' }}>
                  <div className={styles.changeContainer}>
                    <span>
                      <FormattedMessage {...MSG.change} />{' '}
                      {key === 'filteredDomainId' ? (
                        <FormattedMessage {...MSG.teamCaption} />
                      ) : (
                        key
                      )}
                    </span>
                    <Button
                      appearance={{ theme: 'dangerLink' }}
                      onClick={() => discardChange(key)}
                    >
                      <FormattedMessage {...MSG.discard} />
                    </Button>
                  </div>
                </FormSection>
                <FormSection appearance={{ border: 'bottom' }}>
                  <div
                    className={classNames(
                      styles.changeContainer,
                      styles.changeItem,
                    )}
                  >
                    <span>
                      <FormattedMessage {...MSG.new} />{' '}
                      {key === 'filteredDomainId' ? (
                        <FormattedMessage {...MSG.teamCaption} />
                      ) : (
                        key
                      )}
                    </span>
                    <span className={styles.changeWrapper}>
                      {renderChange(value, key)}
                    </span>
                  </div>
                </FormSection>
              </React.Fragment>
            );
          })
        )}
      </div>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotationsWrapper}>
          <Annotations
            label={
              values.forceAction ? MSG.forceTextareaLabel : MSG.descriptionLabel
            }
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
