import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import classNames from 'classnames';

import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, Annotations, Radio, Toggle } from '~core/Fields';

import { ActionTypes } from '~redux/actionTypes';
import styles from './CancelExpenditureDialog.css';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { Colony } from '~data/index';
import { Tooltip } from '~core/Popover';
import Icon from '~core/Icon';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { tokens } from '~dashboard/ExpenditurePage/ExpenditureSettings/consts';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';

const displayName = 'dashboard.CancelExpenditureDialog';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelExpenditureDialog.header',
    defaultMessage: 'Cancel payment',
  },
  force: {
    id: 'dashboard.CancelExpenditureDialog.force',
    defaultMessage: 'Force',
  },
  ownersStake: {
    id: 'dashboard.CancelExpenditureDialog.ownersStake',
    defaultMessage: 'Owner’s stake',
  },
  shouldBePenalized: {
    id: 'dashboard.CancelExpenditureDialog.shouldBePenalized',
    defaultMessage: 'Do you want to penalize the owner?',
  },
  penalize: {
    id: 'dashboard.CancelExpenditureDialog.penalize',
    defaultMessage: 'Penalize',
  },
  showMercy: {
    id: 'dashboard.CancelExpenditureDialog.showMercy',
    defaultMessage: 'Show mercy',
  },
  penalizeMessage: {
    id: 'dashboard.CancelExpenditureDialog.penalizeMessage',
    defaultMessage: 'Owner will lose their stake and equivalent reputation.',
  },
  mercyMessage: {
    id: 'dashboard.CancelExpenditureDialog.mercyMessage',
    defaultMessage: 'Owner will keep their stake and reputation.',
  },
  submit: {
    id: 'dashboard.CancelExpenditureDialog.submit',
    defaultMessage: 'Submit',
  },
  textareaLabel: {
    id: 'dashboard.CancelExpenditureDialog.textareaLabel',
    defaultMessage: 'Explain why you’re cancelling this payment (optional)',
  },
  effectTooltip: {
    id: 'dashboard.CancelExpenditureDialog.effectTooltip',
    defaultMessage: 'Do you want to penalize the owner?', // add correct value here
  },
});

export const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  effect: yup.string().required(),
  annotation: yup.string(),
});

interface FormValues {
  forceAction: boolean;
  effect: string;
  annotation: string;
}

interface Props {
  close: () => void;
  colony?: Colony;
  onClick: (isForce: boolean) => void;
}

const CancelExpenditureDialog = ({ close, colony, onClick }: Props) => {
  const [isForce, setIsForce] = useState(false);
  const [domainID, setDomainID] = useState<number>();

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isForce],
  );

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false, effect: 'penalize' }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema}
    >
      {({ values, isSubmitting, handleSubmit }: FormikProps<FormValues>) => {
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
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
                {colony && (
                  <MotionDomainSelect
                    colony={colony}
                    onDomainChange={handleMotionDomainChange}
                    initialSelectedDomain={domainID}
                  />
                )}
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
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                className={styles.title}
              >
                <FormattedMessage {...MSG.header} />
              </Heading>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div
                className={classNames(styles.row, styles.tokens, {
                  [styles.top]: tokens.length > 1,
                })}
              >
                <FormattedMessage {...MSG.ownersStake} />
                <div className={styles.tokensWarpper}>
                  {tokens?.map((token, index) => (
                    <div
                      className={classNames(styles.value, {
                        [styles.paddingBottom]:
                          tokens.length > 1 && index !== tokens.length - 1,
                      })}
                    >
                      <TokenIcon
                        className={styles.tokenIcon}
                        token={token}
                        name={token.name || token.address}
                      />
                      <Numeral
                        unit={getTokenDecimalsWithFallback(0)}
                        value={0.1}
                      />{' '}
                      {token.symbol}
                    </div>
                  ))}
                </div>
              </div>
            </DialogSection>
            <DialogSection>
              <div className={styles.radioGroup}>
                <div className={styles.textWrapper}>
                  <FormattedMessage {...MSG.shouldBePenalized} />
                  <Tooltip
                    content={
                      <div className={styles.tooltip}>
                        <FormattedMessage {...MSG.effectTooltip} />
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
                <div
                  className={classNames(styles.radioWrapper, {
                    [styles.selected]: values.effect === 'penalize',
                  })}
                >
                  <Radio
                    name="effect"
                    value="penalize"
                    checked={values.effect === 'penalize'}
                    elementOnly
                  >
                    <FormattedMessage {...MSG.penalize} />
                  </Radio>
                </div>
                <div
                  className={classNames(styles.radioWrapper, {
                    [styles.selected]: values.effect === 'mercy',
                  })}
                >
                  <Radio
                    name="effect"
                    value="mercy"
                    checked={values.effect === 'mercy'}
                    elementOnly
                  >
                    <FormattedMessage {...MSG.showMercy} />
                  </Radio>
                </div>
              </div>
              <div
                className={classNames(styles.message, {
                  [styles.messageWarning]: values.effect === 'penalize',
                })}
              >
                <FormattedMessage
                  {...(values.effect === 'penalize'
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
                text={MSG.submit}
                type="submit"
                onClick={() => {
                  // onClick and close are temporary, only handleSubmit should stay here
                  onClick(isForce);
                  close();
                  handleSubmit();
                }}
              />
            </DialogSection>
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

CancelExpenditureDialog.displayName = displayName;

export default CancelExpenditureDialog;
