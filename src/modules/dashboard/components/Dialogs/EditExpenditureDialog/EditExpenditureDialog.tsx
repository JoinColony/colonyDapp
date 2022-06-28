import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import * as yup from 'yup';

import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, Annotations, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
// import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { ActionTypes } from '~redux/actionTypes';
// import { getTokenDecimalsWithFallback } from '~utils/tokens';
// import TokenIcon from '~dashboard/HookedTokenIcon';
import styles from './EditExpenditureDialog.css';
// import UserAvatar from '~core/UserAvatar';
// import UserMention from '~core/UserMention';
// import Delay from '~dashboard/ExpenditurePage/Delay';
import Button from '~core/Button';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { useColonyFromNameQuery } from '~data/generated';
import { SpinnerLoader } from '~core/Preloaders';
import { FormValues } from '~pages/ExpenditurePage/ExpenditurePage';

const MSG = defineMessages({
  header: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  headerForce: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.headerForce',
    defaultMessage: 'Create a motion to edit expenditure',
  },
  force: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.force',
    defaultMessage: 'Force',
  },
  team: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.team',
    defaultMessage: 'Motion will be created in ',
  },
  descriptionText: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.descriptionText',
    defaultMessage: `Payment is currently at the locked stage.
    Any edits require at this point an action to be made.
    You can either enforce permission,
    or create a motion to get collective approval.`,
  },
  newRecipient: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.newRecipient',
    defaultMessage: 'New recipient',
  },
  newAmount: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.newAmount',
    defaultMessage: 'New amount',
  },
  newClaimDelay: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.newClaimDelay',
    defaultMessage: 'New claim delay',
  },
  descriptionLabel: {
    id: 'dashboard.Expenditures.Edit.editConfirmDialog.descriptionLabel',
    defaultMessage: 'Explain why youre changing the payment (optional)',
  },
  cancelText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.cancelText',
    defaultMessage: 'Back',
  },
  confirmText: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.confirmText',
    defaultMessage: 'Create motion',
  },
  confirmTexForce: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.confirmTexForce',
    defaultMessage: 'Force change',
  },
  textareaLabel: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.textareaLabel',
    defaultMessage: 'Explain why you`re changing the payment (optional)',
  },
  forceTextareaLabel: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.textareaLabel',
    defaultMessage: 'Explain why you`re changing the expenditure',
  },
  errorAnnotation: {
    id: 'dashboard.Expenditures.Stages.draftConfirmDialog.errorAnnotation',
    defaultMessage: 'Annotation is required',
  },
});

const validationSchema = (annotationErrorMessage) =>
  yup.object().shape({
    forceAction: yup.bool(),
    // eslint-disable-next-line func-names
    annotationMessage: yup
      .string()
      .test('isRequired', annotationErrorMessage, function (value) {
        const isRequired = this?.parent?.forceAction;
        return isRequired ? isRequired && value : true;
      }),
  });

interface FormValuesType {
  forceAction: boolean;
}

type Props = {
  onClick: () => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colonyName: string;
  formValues: FormValues;
};

const EditExpenditureDialog = ({
  close,
  onClick,
  isVotingExtensionEnabled,
  colonyName,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const [domainID, setDomainID] = useState<number>();
  const { formatMessage } = useIntl();

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { address: '', name: colonyName },
  });
  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema(formatMessage(MSG.errorAnnotation))}
    >
      {({
        values,
        handleSubmit,
        isSubmitting,
      }: FormikProps<FormValuesType>) => {
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <DialogSection>
              {loading ? (
                <SpinnerLoader />
              ) : (
                colonyData && (
                  <div
                    className={classNames(
                      styles.row,
                      styles.withoutPadding,
                      styles.forceRow,
                    )}
                  >
                    <FormattedMessage {...MSG.team} />
                    <MotionDomainSelect
                      colony={colonyData.processedColony}
                      onDomainChange={handleMotionDomainChange}
                      initialSelectedDomain={domainID}
                    />
                    <div className={styles.forceContainer}>
                      <FormattedMessage {...MSG.force} />
                      <div className={styles.toggleContainer}>
                        <Toggle
                          name="forceAction"
                          appearance={{ theme: 'danger' }}
                          disabled={isSubmitting}
                        />
                      </div>

                      <Tooltip
                        content={
                          <div className={styles.tooltip}>
                            <FormattedMessage id="tooltip.forceAction" />
                          </div>
                        }
                        trigger="hover"
                        popperOptions={{
                          placement: 'top-end',
                          strategy: 'fixed',
                        }}
                      >
                        <Icon
                          name="question-mark"
                          className={styles.questionIcon}
                        />
                      </Tooltip>
                    </div>
                  </div>
                )
              )}
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                className={styles.title}
              >
                <FormattedMessage
                  {...(isForce ? MSG.headerForce : MSG.header)}
                />
              </Heading>
              <div className={styles.descriptionWrapper}>
                <FormattedMessage {...MSG.descriptionText} />
              </div>
            </DialogSection>
            <div className={styles.contentWrapper} />
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <Annotations
                label={isForce ? MSG.forceTextareaLabel : MSG.textareaLabel}
                name="annotationMessage"
                maxLength={90}
              />
            </DialogSection>
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.cancelText}
                onClick={close}
              />
              <Button
                appearance={{
                  theme: isForce ? 'danger' : 'primary',
                  size: 'large',
                }}
                autoFocus
                text={isForce ? MSG.confirmTexForce : MSG.confirmText}
                onClick={(e) => {
                  handleSubmit(e as any);
                  onClick();
                  close();
                }}
              />
            </DialogSection>
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

export default EditExpenditureDialog;
