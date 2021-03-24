import React, { useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { FormikProps } from 'formik';
import moveDecimal from 'move-decimal-point';
import * as yup from 'yup';

import Button from '~core/Button';
import { ActionForm, Input } from '~core/Fields';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';

import { UserToken } from '~data/generated';
import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { pipe, mapPayload } from '~utils/actions';

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
    defaultMessage: 'Locked: {tokenBalance}',
  },
  lockedTooltip: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.lockedTooltip`,
    defaultMessage: `You have unclaimed transactions which must be claimed
    before these tokens can be withdrawn.`,
  },
});

const validationSchema = yup.object({
  amount: yup.number().required().moreThan(0),
});

type FormValues = {
  amount: number;
};

export interface ChangeTokenStateFormProps {
  token: UserToken;
  tokenDecimals: number;
  activeTokens: BigNumber;
  inactiveTokens: BigNumber;
  hasLockedTokens: boolean;
  colonyAddress: Address;
}

const ChangeTokenStateForm = ({
  token,
  tokenDecimals,
  activeTokens,
  inactiveTokens,
  hasLockedTokens,
  colonyAddress,
}: ChangeTokenStateFormProps) => {
  const [isActivate, setIsActive] = useState(true);

  const { walletAddress } = useLoggedInUser();

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
        const formtattedAmount = bigNumberify(
          moveDecimal(amount, tokenDecimals),
        );

        return {
          amount: formtattedAmount,
          userAddress: walletAddress,
          colonyAddress,
          tokenAddress: token.address,
        };
      }),
    ),
    [],
  );

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
      >
        {({ isValid, values }: FormikProps<FormValues>) => (
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
                        value={isActivate ? activeTokens : inactiveTokens}
                        suffix={` ${token?.symbol}`}
                        unit={tokenDecimals}
                        truncate={3}
                        className={styles.balanceAmount}
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              <Tooltip
                darkTheme
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
                      tokenBalance: (
                        <Numeral
                          value={isActivate ? activeTokens : inactiveTokens}
                          suffix={` ${token?.symbol}`}
                          unit={tokenDecimals}
                          truncate={3}
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
                (!isActivate && hasLockedTokens)
              }
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

export default ChangeTokenStateForm;
