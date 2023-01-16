import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionForm, Annotations, Radio, Toggle } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Colony, useLoggedInUser } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Dialog, { DialogSection } from '~core/Dialog';
import Button from '~core/Button';
import Heading from '~core/Heading';
import { tokens as tokensMock } from '~dashboard/ExpenditurePage/ExpenditureSettings/constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { hasRoot } from '~modules/users/checks';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import Numeral from '~core/Numeral';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { PenalizeType } from './types';
import styles from './CancelIncorporationDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelExpenditureDialog.CancelIncorporationDialog.header',
    defaultMessage: 'Cancel incorporation',
  },
  ownersStake: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.ownersStake`,
    defaultMessage: `Owner's stake`,
  },
  shouldBePenalized: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.shouldBePenalized`,
    defaultMessage: 'Should the owner be penalized?',
  },
  penalize: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.penalize`,
    defaultMessage: 'Penalize',
  },
  showMercy: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.showMercy`,
    defaultMessage: 'Show mercy',
  },
  penalizeMessage: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.penalizeMessage`,
    defaultMessage: 'Owner will lose their stake and equivalent reputation.',
  },
  mercyMessage: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.mercyMessage`,
    defaultMessage: 'Owner will keep their stake and reputation.',
  },
  submit: {
    id: 'dashboard.CancelExpenditureDialog.CancelIncorporationDialog.submit',
    defaultMessage: 'Submit',
  },
  textareaLabel: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.textareaLabel`,
    defaultMessage: `Explain why you're cancelling incorporation (optional)`,
  },
  effectTooltip: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.effectTooltip`,
    defaultMessage: `Decide what to do with the owner's stake when cancelling this incorporation.`,
  },
  createDomain: {
    id: `dashboard.CancelExpenditureDialog.CancelIncorporationDialog.createDomain`,
    defaultMessage: 'Motion will be created in',
  },
});

const displayName = 'dashboard.CancelIncorporationDialog';

export const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  effect: yup.string().required(),
  annotation: yup.string(),
});

export interface FormValues {
  forceAction: boolean;
  effect: PenalizeType;
  annotation: string;
}

interface Props {
  close: () => void;
  colony: Colony;
  onCancelExpenditure: (isForce: boolean) => void;
  isVotingExtensionEnabled: boolean;
}

const CancelIncorporationDialog = ({
  close,
  colony,
  onCancelExpenditure,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isForce],
  );

  const [token] = tokensMock;
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelExpenditure = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelExpenditure,
    isVotingExtensionEnabled,
    true,
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false, effect: PenalizeType.Penalize }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <DialogSection>
              <div
                className={classNames(
                  styles.row,
                  styles.withoutPadding,
                  styles.forceRow,
                )}
              >
                {colony && <MotionDomainSelect colony={colony} />}
                {canCancelExpenditure && isVotingExtensionEnabled && (
                  <div className={styles.toggleContainer}>
                    <Toggle
                      label={{ id: 'label.force' }}
                      name="forceAction"
                      appearance={{ theme: 'danger' }}
                      disabled={!userHasPermission || formValues.isSubmitting}
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
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={classNames(styles.row, styles.tokens)}>
                <FormattedMessage {...MSG.ownersStake} />
                <div className={styles.value}>
                  <TokenIcon
                    className={styles.tokenIcon}
                    token={token}
                    name={token.name || token.address}
                  />
                  <Numeral unit={getTokenDecimalsWithFallback(0)} value={0.1} />
                  {token.symbol}
                </div>
              </div>
            </DialogSection>
            <DialogSection>
              <div className={styles.radioGroup}>
                <div className={styles.textWrapper}>
                  <FormattedMessage {...MSG.shouldBePenalized} />
                  <QuestionMarkTooltip
                    tooltipText={MSG.effectTooltip}
                    tooltipPopperOptions={{
                      placement: 'top',
                      strategy: 'fixed',
                    }}
                  />
                </div>
                <div
                  className={classNames(styles.radioWrapper, {
                    [styles.selected]:
                      formValues.values.effect === PenalizeType.Penalize,
                  })}
                >
                  <Radio
                    name="effect"
                    value={PenalizeType.Penalize}
                    checked={formValues.values.effect === PenalizeType.Penalize}
                    elementOnly
                  >
                    <FormattedMessage {...MSG.penalize} />
                  </Radio>
                </div>
                <div
                  className={classNames(styles.radioWrapper, {
                    [styles.selected]:
                      formValues.values.effect === PenalizeType.Mercy,
                  })}
                >
                  <Radio
                    name="effect"
                    value={PenalizeType.Mercy}
                    checked={formValues.values.effect === PenalizeType.Mercy}
                    elementOnly
                  >
                    <FormattedMessage {...MSG.showMercy} />
                  </Radio>
                </div>
              </div>
              <div
                className={classNames(styles.message, {
                  [styles.messageWarning]:
                    formValues.values.effect === PenalizeType.Penalize,
                })}
              >
                <FormattedMessage
                  {...(formValues.values.effect === PenalizeType.Penalize
                    ? MSG.penalizeMessage
                    : MSG.mercyMessage)}
                />
              </div>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.annotations}>
                <Annotations
                  label={MSG.textareaLabel}
                  name="annotation"
                  maxLength={90}
                />
              </div>
            </DialogSection>
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                appearance={{
                  theme: 'primary',
                  size: 'large',
                }}
                style={{
                  width: styles.buttonWidth,
                }}
                autoFocus
                text={{ id: 'button.submit' }}
                type="submit"
                onClick={() => {
                  onCancelExpenditure(formValues.values.forceAction);
                  close();
                  formValues.handleSubmit();
                }}
              />
            </DialogSection>
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

CancelIncorporationDialog.displayName = displayName;

export default CancelIncorporationDialog;
