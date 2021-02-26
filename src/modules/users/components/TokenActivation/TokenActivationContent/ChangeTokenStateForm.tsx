import React, { useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { FormikProps } from 'formik';
import moveDecimal from 'move-decimal-point';
import * as yup from 'yup';

import Button from '~core/Button';
import { ActionForm, Input } from '~core/Fields';
import Numeral from '~core/Numeral';

import { UserToken } from '~data/generated';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload } from '~utils/actions';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  changeState: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.changeState',
    defaultMessage: 'Change token state',
  },
  activate: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.activate',
    defaultMessage: 'Activate',
  },
  withdraw: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.withdraw',
    defaultMessage: 'Withdraw',
  },
  balance: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.balance',
    defaultMessage: 'balance: {tokenBalance}',
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
}

const ChangeTokenStateForm = ({
  token,
  tokenDecimals,
  activeTokens,
  inactiveTokens,
}: ChangeTokenStateFormProps) => {
  const [isActivate, setIsActivate] = useState(true);

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        // Convert amount string with decimals to BigInt (eth to wei)
        const formtattedAmount = bigNumberify(
          moveDecimal(amount, tokenDecimals),
        );

        return { amount: formtattedAmount };
      }),
    ),
    [],
  );

  return (
    <div className={styles.changeTokensState}>
      <div className={styles.changeStateTitle}>
        <FormattedMessage {...MSG.changeState} />
      </div>
      <div className={styles.changeStateButtonsContainer}>
        <div
          className={
            isActivate ? styles.activateButton : styles.activateButtonInactive
          }
        >
          <Button
            appearance={{ theme: isActivate ? 'primary' : 'white' }}
            onClick={() => setIsActivate(true)}
            text={MSG.activate}
          />
        </div>
        <div
          className={
            isActivate ? styles.withdrawButtonInactive : styles.withdrawButton
          }
        >
          <Button
            appearance={{ theme: !isActivate ? 'primary' : 'white' }}
            onClick={() => setIsActivate(false)}
            text={MSG.withdraw}
          />
        </div>
      </div>
      <ActionForm
        initialValues={{ amount: undefined }}
        validationSchema={validationSchema}
        transform={transform}
        submit={
          isActivate
            ? ActionTypes.USER_DEPOSIT_TOKEN
            : ActionTypes.USER_WITHDRAW_TOKEN
        }
        error={
          isActivate
            ? ActionTypes.USER_DEPOSIT_TOKEN_ERROR
            : ActionTypes.USER_WITHDRAW_TOKEN_ERROR
        }
        success={
          isActivate
            ? ActionTypes.USER_DEPOSIT_TOKEN_SUCCESS
            : ActionTypes.USER_WITHDRAW_TOKEN_SUCCESS
        }
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
            <Button
              text={{ id: 'button.confirm' }}
              type="submit"
              disabled={!isValid || values.amount === undefined}
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

export default ChangeTokenStateForm;
