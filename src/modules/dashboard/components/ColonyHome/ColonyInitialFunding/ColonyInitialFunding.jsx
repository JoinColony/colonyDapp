/* @flow */

import type { FormikProps } from 'formik';

// $FlowFixMe
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';
import type { TokenType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import { tokenFetcher } from '../../../fetchers';

import Heading from '~core/Heading';
import Button from '~core/Button';
import { Input } from '~core/Fields';
import { TokenMintForm } from '~admin/Tokens';

import styles from './ColonyInitialFunding.css';

type Props = {|
  colonyAddress: Address,
  displayName: string,
  tokenAddress: Address,
|};

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyInitialFunding.title',
    defaultMessage: 'Welcome to {displayName}!',
  },
  fundingPrompt: {
    id: 'dashboard.ColonyInitialFunding.fundingPrompt',
    defaultMessage:
      // eslint-disable-next-line max-len
      'First things first, fund the colony with tokens so that you can reward contributors for work.',
  },
  mintNewTokens: {
    id: 'dashboard.ColonyInitialFunding.dialogTitle',
    defaultMessage: 'Mint new tokens',
  },
  amountLabel: {
    id: 'dashboard.ColonyInitialFunding.amountLabel',
    defaultMessage: 'Amount',
  },
});

const ColonyInitialFunding = ({
  colonyAddress,
  displayName,
  tokenAddress,
}: Props) => {
  const { data: nativeToken } = useDataFetcher<TokenType>(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );
  // @todo Provide a means to determine whether the native token was created externally
  const isExternal = false;
  return nativeToken && !isExternal ? (
    <div className={styles.container}>
      <Heading
        appearance={{ size: 'medium' }}
        text={MSG.title}
        textValues={{ displayName }}
      />
      <p className={styles.fundingPrompt}>
        <FormattedMessage {...MSG.fundingPrompt} />
      </p>
      <TokenMintForm colonyAddress={colonyAddress} nativeToken={nativeToken}>
        {({
          handleSubmit,
          isSubmitting,
          isValid,
        }: FormikProps<{|
          mintAmount: number,
        |}>) => (
          <div className={styles.mintTokensForm}>
            <Heading appearance={{ size: 'normal' }} text={MSG.mintNewTokens} />
            <div className={styles.inputContainer}>
              <div className={styles.input}>
                <Input
                  appearance={{ theme: 'minimal' }}
                  formattingOptions={{
                    numeral: true,
                    numeralPositiveOnly: true,
                    numeralDecimalScale: nativeToken.decimals || 18,
                  }}
                  label={MSG.amountLabel}
                  name="mintAmount"
                />
              </div>
              <span className={styles.nativeToken} title={nativeToken.name}>
                {nativeToken.symbol}
              </span>
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                onClick={handleSubmit}
                text={MSG.mintNewTokens}
                loading={isSubmitting}
                disabled={!isValid}
              />
            </div>
          </div>
        )}
      </TokenMintForm>
    </div>
  ) : null;
};

ColonyInitialFunding.displayName = 'dashboard.ColonyInitialFunding';

export default ColonyInitialFunding;
