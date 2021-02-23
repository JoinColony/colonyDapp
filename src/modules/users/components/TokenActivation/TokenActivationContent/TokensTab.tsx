import React, { useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import { BigNumber, bigNumberify } from 'ethers/utils';

import Button from '~core/Button';
import { ActionForm, Input } from '~core/Fields';
import Icon from '~core/Icon';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { UserToken } from '~data/generated';

import { ActionTypes } from '~redux/index';
import { pipe, mapPayload } from '~utils/actions';
import { formatTokenValue } from '~utils/numbers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  active: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.active',
    defaultMessage: 'Active',
  },
  inactive: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.inactive',
    defaultMessage: 'Inactive',
  },
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
});

const validationSchema = yup.object({
  amount: yup.number(),
});

type FormValues = {
  amount: number;
};

export interface TokensTabProps {
  activeTokens: BigNumber;
  inactiveTokens: BigNumber;
  totalTokens: BigNumber;
  lockedTokens: BigNumber;
  token: UserToken;
}

const TokensTab = ({
  activeTokens,
  inactiveTokens,
  totalTokens,
  lockedTokens,
  token,
}: TokensTabProps) => {
  const [isActivate, setIsActivate] = useState(true);

  const formattedTotalAmount = formatTokenValue({
    value: totalTokens,
    suffix: ` ${token?.symbol}`,
    unit: getTokenDecimalsWithFallback(token?.decimals),
    truncate: 3,
  }).split(' ')[0];

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        const decimals = getTokenDecimalsWithFallback(token?.decimals);

        // Convert amount string with decimals to BigInt (eth to wei)
        const formtattedAmount = bigNumberify(moveDecimal(amount, decimals));

        return { amount: formtattedAmount };
      }),
    ),
    [],
  );

  return (
    <>
      <div className={styles.totalTokensContainer}>
        <TokenIcon token={token || {}} size="xs" />
        <p className={styles.totalTokens}>
          {formattedTotalAmount} <span>{token?.symbol}</span>
        </p>
      </div>
      <div className={styles.tokensDetailsContainer}>
        <ul>
          <li>
            <div className={styles.listItem}>
              <div className={styles.greenDisc} />
              <p className={styles.listItemTitle}>
                <FormattedMessage {...MSG.active} />
              </p>
            </div>
            <div className={styles.tokenNumbers}>
              <Numeral
                value={activeTokens}
                suffix={` ${token?.symbol}`}
                unit={getTokenDecimalsWithFallback(token?.decimals)}
                truncate={3}
              />
            </div>
            <div className={styles.lockedAmountContainer}>
              <Icon
                title="padlock"
                appearance={{ size: 'extraTiny' }}
                name="emoji-padlock-closed"
              />
              <Numeral
                className={styles.lockedAmount}
                value={lockedTokens}
                suffix={` ${token?.symbol}`}
                unit={getTokenDecimalsWithFallback(token?.decimals)}
                truncate={3}
              />
            </div>
          </li>
          <li>
            <div className={styles.listItem}>
              <div className={styles.redDisc} />
              <p className={styles.listItemTitle}>
                <FormattedMessage {...MSG.inactive} />
              </p>
            </div>
            <div className={styles.tokenNumbers}>
              <Numeral
                value={inactiveTokens}
                suffix={` ${token?.symbol}`}
                unit={getTokenDecimalsWithFallback(token?.decimals)}
                truncate={3}
              />
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.changeTokensState}>
        <div className={styles.changeStateTitle}>
          <FormattedMessage {...MSG.changeState} />
        </div>
        <div className={styles.changeStateButtonsContainer}>
          <Button
            appearance={{ theme: isActivate ? 'primary' : 'secondary' }}
            className={!isActivate ? styles.leftBorders : ''}
            onClick={() => setIsActivate(true)}
            text={MSG.activate}
          />
          <Button
            appearance={{ theme: !isActivate ? 'primary' : 'secondary' }}
            className={isActivate ? styles.rightBorders : ''}
            onClick={() => setIsActivate(false)}
            text={MSG.withdraw}
          />
        </div>
        <ActionForm
          initialValues={{ amount: 0 }}
          validationSchema={validationSchema}
          transform={transform}
          // temporary PLACEHOLDER !!!!!!!!!
          submit={ActionTypes.COLONY_CREATE}
          error={ActionTypes.COLONY_CREATE_ERROR}
          success={ActionTypes.COLONY_CREATE_SUCCESS}
        >
          {() => (
            <div className={styles.form}>
              <div className={styles.inputField}>
                <Input
                  name="amount"
                  appearance={{
                    theme: 'minimal',
                    align: 'right',
                  }}
                  status="boooooo"
                  formattingOptions={{
                    delimiter: ',',
                    numeral: true,
                    numeralDecimalScale: getTokenDecimalsWithFallback(
                      token?.decimals,
                    ),
                  }}
                />
              </div>
              <Button text={{ id: 'button.confirm' }} type="submit" />
            </div>
          )}
        </ActionForm>
      </div>
    </>
  );
};

export default TokensTab;
