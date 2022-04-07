import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { FormikProps } from 'formik';
import moveDecimal from 'move-decimal-point';
import * as yup from 'yup';
import Decimal from 'decimal.js';
import toFinite from 'lodash/toFinite';

import Button from '~core/Button';
import { ActionForm, Input } from '~core/Fields';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';

import { UserToken } from '~data/generated';
import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { pipe, mapPayload } from '~utils/actions';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  tokenActivation: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.tokenActivation`,
    defaultMessage: 'Token activation',
  },
  activate: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.activate`,
    defaultMessage: 'Activate',
  },
  deactivate: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.deactivate`,
    defaultMessage: 'Deactivate',
  },
  balance: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.balance`,
    defaultMessage: 'balance: {tokenBalance}',
  },
  locked: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.locked`,
    defaultMessage: 'Locked: {lockedTokens}',
  },
  lockedTooltip: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.lockedTooltip`,
    defaultMessage: `You have unclaimed transactions which must be claimed
    before these tokens can be withdrawn.`,
  },
  max: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.max`,
    defaultMessage: 'Max',
  },
});

const validationSchema = yup.object({
  amount: yup
    .number()
    .transform((value) => toFinite(value))
    .required()
    .moreThan(0),
});

type FormValues = {
  amount: number;
};

export interface ChangeTokenStateFormProps {
  token: UserToken;
  tokenDecimals: number;
  activeTokens: BigNumber;
  inactiveTokens: BigNumber;
  lockedTokens: BigNumber;
  hasLockedTokens: boolean;
  colonyAddress: Address;
}

const ChangeTokenStateForm = ({
  token,
  tokenDecimals,
  activeTokens,
  inactiveTokens,
  lockedTokens,
  hasLockedTokens,
  colonyAddress,
}: ChangeTokenStateFormProps) => {
  const [isActivate, setIsActive] = useState(true);

  const { walletAddress } = useLoggedInUser();

  const formattedActiveTokens = getFormattedTokenValue(
    activeTokens,
    token.decimals,
  );
  const formattedInactiveTokens = getFormattedTokenValue(
    inactiveTokens,
    token.decimals,
  );
  const formattedLockedTokens = getFormattedTokenValue(
    lockedTokens,
    token.decimals,
  );
  const unformattedTokenBalance = moveDecimal(
    isActivate ? inactiveTokens : activeTokens,
    -tokenDecimals,
  );

  const tokenBalance = useMemo(
    () => (isActivate ? formattedInactiveTokens : formattedActiveTokens),
    [isActivate, formattedActiveTokens, formattedInactiveTokens],
  );

  const formAction = useCallback(
    (actionType: '' | '_ERROR' | '_SUCCESS') =>
      isActivate
        ? ActionTypes[`USER_DEPOSIT_TOKEN${actionType}`]
        : ActionTypes[`USER_WITHDRAW_TOKEN${actionType}`],
    [isActivate],
  );

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        // Convert amount string with decimals to BigInt (eth to wei)
        const formattedAmount = bigNumberify(
          moveDecimal(amount, tokenDecimals),
        );

        return {
          amount: formattedAmount,
          userAddress: walletAddress,
          colonyAddress,
          tokenAddress: token.address,
        };
      }),
    ),
    [],
  );

  const handleSubmitSuccess = useCallback((_, { resetForm }) => {
    resetForm();
  }, []);

  return (
    <div className={styles.changeTokensState}>
      <div className={styles.changeStateTitle}>
        <FormattedMessage {...MSG.tokenActivation} />
      </div>
      <div className={styles.changeStateButtonsContainer}>
        <div className={isActivate ? styles.activate : styles.activateInactive}>
          <Button
            appearance={{ theme: isActivate ? 'primary' : 'white' }}
            onClick={() => setIsActive(true)}
            text={MSG.activate}
          />
        </div>
        <div className={isActivate ? styles.withdrawInactive : styles.withdraw}>
          <Button
            appearance={{ theme: !isActivate ? 'primary' : 'white' }}
            onClick={() => setIsActive(false)}
            text={MSG.deactivate}
          />
        </div>
      </div>
      <ActionForm
        initialValues={{ amount: undefined }}
        validationSchema={validationSchema}
        transform={transform}
        submit={formAction('')}
        error={formAction('_ERROR')}
        success={formAction('_SUCCESS')}
        onSuccess={handleSubmitSuccess}
      >
        {({ isValid, values, setFieldValue }: FormikProps<FormValues>) => (
          <div className={styles.form}>
            <div className={styles.inputField}>
              <Input
                name="amount"
                appearance={{
                  theme: 'minimal',
                  align: 'right',
                }}
                elementOnly
                formattingOptions={{
                  delimiter: ',',
                  numeral: true,
                  numeralDecimalScale: tokenDecimals,
                }}
                maxButtonParams={{
                  setFieldValue,
                  maxAmount: unformattedTokenBalance,
                  fieldName: 'amount',
                }}
              />
            </div>
            {!hasLockedTokens || isActivate ? (
              <div
                className={
                  isActivate
                    ? styles.balanceInfoActivate
                    : styles.balanceInfoWithdraw
                }
              >
                <FormattedMessage
                  {...MSG.balance}
                  values={{
                    tokenBalance: (
                      <Numeral
                        value={tokenBalance}
                        suffix={` ${token?.symbol}`}
                        className={styles.balanceAmount}
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              <Tooltip
                placement="right"
                content={<FormattedMessage {...MSG.lockedTooltip} />}
              >
                <div
                  className={
                    hasLockedTokens
                      ? styles.balanceInfoWithdrawLocked
                      : styles.balanceInfoWithdraw
                  }
                >
                  <FormattedMessage
                    {...(hasLockedTokens ? MSG.locked : MSG.balance)}
                    values={{
                      lockedTokens: (
                        <Numeral
                          value={formattedLockedTokens}
                          suffix={` ${token?.symbol}`}
                          className={styles.balanceAmount}
                        />
                      ),
                    }}
                  />
                </div>
              </Tooltip>
            )}
            <Button
              text={{ id: 'button.confirm' }}
              type="submit"
              disabled={
                !isValid ||
                values.amount === undefined ||
                new Decimal(unformattedTokenBalance).lt(
                  /* a bit hacky way of doing the check but nothing else seems to be working */
                  values.amount.toString() === '.' ? 0 : values.amount || 0,
                )
              }
              dataTest="tokenActivationConfirm"
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

export default ChangeTokenStateForm;
