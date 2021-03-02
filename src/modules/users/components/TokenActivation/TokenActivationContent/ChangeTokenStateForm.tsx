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
import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { pipe, mapPayload } from '~utils/actions';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  changeState: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.changeState`,
    defaultMessage: 'Change token state',
  },
  activate: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.activate`,
    defaultMessage: 'Activate',
  },
  withdraw: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.withdraw`,
    defaultMessage: 'Withdraw',
  },
  balance: {
    id: `users.TokenActivation.TokenActivationContent.ChangeTokenStateForm.balance`,
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
  colonyAddress: Address;
}

const ChangeTokenStateForm = ({
  token,
  tokenDecimals,
  activeTokens,
  inactiveTokens,
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
        };
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
            text={MSG.withdraw}
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
