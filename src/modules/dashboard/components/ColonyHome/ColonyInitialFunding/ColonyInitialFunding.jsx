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
import QRCode from '~core/QRCode';
import { TokenMintForm } from '~admin/Tokens';

import styles from './ColonyInitialFunding.css';
import CopyableAddress from '~core/CopyableAddress';

type Props = {|
  canMintTokens: boolean,
  colonyAddress: Address,
  displayName: string,
  isExternal?: boolean,
  showQrCode: boolean,
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
  qrCodeDescriptionExternal: {
    id: 'dashboard.ColonyInitialFunding.qrCodeDescriptionExternal',
    // eslint-disable-next-line max-len
    defaultMessage: `Send any ETH or ERC20 tokens to your colony's address below:`,
  },
  qrCodeDescription: {
    id: 'dashboard.ColonyInitialFunding.qrCodeDescription',
    // eslint-disable-next-line max-len
    defaultMessage: `Or send any ETH or ERC20 tokens to your colony's address below:`,
  },
});

const ColonyInitialFunding = ({
  canMintTokens,
  showQrCode,
  colonyAddress,
  isExternal,
  displayName,
  tokenAddress,
}: Props) => {
  const { data: nativeToken } = useDataFetcher<TokenType>(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );

  if (!nativeToken) {
    return null;
  }

  return (
    <>
      {canMintTokens && (
        <div className={styles.container}>
          <Heading
            appearance={{ size: 'medium' }}
            text={MSG.title}
            textValues={{ displayName }}
          />
          <p className={styles.fundingPrompt}>
            <FormattedMessage {...MSG.fundingPrompt} />
          </p>
          <TokenMintForm
            colonyAddress={colonyAddress}
            nativeToken={nativeToken}
          >
            {({
              handleSubmit,
              isSubmitting,
              isValid,
            }: FormikProps<{|
              mintAmount: number,
            |}>) => (
              <div className={styles.mintTokensForm}>
                <Heading
                  appearance={{ size: 'normal' }}
                  text={MSG.mintNewTokens}
                />
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
      )}
      {showQrCode && (
        <div className={styles.qrCodeContainer}>
          <div className={styles.qrCode}>
            <QRCode address={colonyAddress} width={50} />
          </div>
          <div className={styles.qrCodeAddress}>
            <FormattedMessage
              className={styles.qrCodeDescription}
              tagName="p"
              {...MSG[
                isExternal ? 'qrCodeDescriptionExternal' : 'qrCodeDescription'
              ]}
            />
            <CopyableAddress full>{colonyAddress}</CopyableAddress>
          </div>
        </div>
      )}
    </>
  );
};

ColonyInitialFunding.displayName = 'dashboard.ColonyInitialFunding';

export default ColonyInitialFunding;
