import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import classNames from 'classnames';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, Annotations, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import { ActionTypes } from '~redux/actionTypes';
import { Colony, useTokenBalancesForDomainsLazyQuery } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { feeAmount, feeToken } from './constants';
import styles from './IncorporationPaymentDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.IncorporationPaymentDialog.header',
    defaultMessage: 'Pay Incorporation fee',
  },
  force: {
    id: 'dashboard.IncorporationPaymentDialog.force',
    defaultMessage: 'Force',
  },
  descriptionText: {
    id: 'dashboard.IncorporationPaymentDialog.descriptionText',
    defaultMessage: `This payment is made directly to Korporatio from your Colony. Create a Motion to get approval for the payment so that the application can be submitted.`,
  },
  details: {
    id: 'dashboard.IncorporationPaymentDialog.details',
    defaultMessage: 'Details',
  },
  fundsAvailable: {
    id: 'dashboard.IncorporationPaymentDialog.fundsAvailable',
    defaultMessage: 'Funds available: {amount}',
  },
  fee: {
    id: 'dashboard.IncorporationPaymentDialog.fee',
    defaultMessage: 'Fee',
  },
  annotationLabel: {
    id: 'dashboard.IncorporationPaymentDialog.annotationLabel',
    defaultMessage: 'Explain why you are making this payment (optional)',
  },
  cancelText: {
    id: 'dashboard.IncorporationPaymentDialog.cancelText',
    defaultMessage: 'Back',
  },
  confirmText: {
    id: 'dashboard.IncorporationPaymentDialog.confirmText',
    defaultMessage: 'Create Motion',
  },
});

const displayName = 'dashboard.IncorporationPaymentDialog';

interface FormValues {
  forceAction: boolean;
}

type Props = {
  onClick: () => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colony: Colony;
};

const IncorporationPaymentDialog = ({
  onClick,
  close,
  isVotingExtensionEnabled,
  colony,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const [
    loadTokenBalances,
    { data: tokenBalancesData },
  ] = useTokenBalancesForDomainsLazyQuery();

  useEffect(() => {
    if (feeToken.address) {
      loadTokenBalances({
        variables: {
          colonyAddress: colony.colonyAddress,
          tokenAddresses: [feeToken.address],
          domainIds: [ROOT_DOMAIN_ID],
        },
      });
    }
  }, [loadTokenBalances, colony.colonyAddress]);

  const fromDomainTokenBalance = useMemo(() => {
    const token =
      tokenBalancesData &&
      tokenBalancesData.tokens.find(
        ({ address }) => address === feeToken.address,
      );
    if (token) {
      return getBalanceFromToken(token);
    }
    return null;
  }, [tokenBalancesData]);

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
    >
      {({ values, handleSubmit, isSubmitting }: FormikProps<FormValues>) => {
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                className={styles.title}
              >
                <div
                  className={classNames(styles.toggleContainer, {
                    [styles.toggleSwitch]: !values.forceAction,
                  })}
                >
                  <MotionDomainSelect
                    colony={colony}
                    /*
                     * @NOTE Always disabled since you can only create this motion in root
                     */
                    disabled
                  />
                  {isVotingExtensionEnabled && (
                    <Toggle
                      label={{ id: 'label.force' }}
                      name="forceAction"
                      appearance={{ theme: 'danger' }}
                      disabled={isSubmitting}
                      tooltipText={{ id: 'tooltip.forceAction' }}
                      tooltipPopperOptions={{
                        placement: 'top-end',
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [8, 8],
                            },
                          },
                        ],
                        strategy: 'fixed',
                      }}
                    />
                  )}
                </div>
                <FormattedMessage {...MSG.header} />
              </Heading>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.messageContainer}>
                <p className={styles.messageParagraph}>
                  <FormattedMessage {...MSG.descriptionText} />
                </p>
              </div>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.amountContainer}>
                <span className={styles.details}>
                  <FormattedMessage {...MSG.details} />
                </span>
                <span className={styles.available}>
                  <FormattedMessage
                    {...MSG.fundsAvailable}
                    values={{
                      amount: (
                        <Numeral
                          value={fromDomainTokenBalance || 0}
                          unit={getTokenDecimalsWithFallback(
                            feeToken && feeToken.decimals,
                          )}
                          suffix={feeToken.symbol}
                        />
                      ),
                    }}
                  />
                </span>
              </div>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.amountContainer}>
                <span>
                  <FormattedMessage {...MSG.fee} />
                </span>
                <div className={styles.label}>
                  <span className={styles.icon}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={feeToken}
                      name={feeToken.name || feeToken.address}
                    />
                  </span>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(
                      feeToken && feeToken.decimals,
                    )}
                    value={feeAmount}
                    suffix={feeToken.symbol}
                  />
                </div>
              </div>
            </DialogSection>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.annotation}>
                <Annotations
                  label={MSG.annotationLabel}
                  name="annotation"
                  maxLength={90}
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
                text={MSG.confirmText}
                style={{
                  width: styles.submitButtonWidth,
                }}
                data-test="confirmButton"
                onClick={() => {
                  // onClick and close are temporary, only handleSubmit should stay here
                  onClick();
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

IncorporationPaymentDialog.displayName = displayName;

export default IncorporationPaymentDialog;
