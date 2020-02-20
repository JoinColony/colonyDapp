import { FormikProps } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';

import Heading from '~core/Heading';
import Button from '~core/Button';
import { Input } from '~core/Fields';
import QRCode from '~core/QRCode';
import CopyableAddress from '~core/CopyableAddress';
import { TokenMintForm } from '~admin/Tokens';
import { useTokenQuery } from '~data/index';

import styles from './ColonyInitialFunding.css';

interface Props {
  canMintTokens: boolean;
  colonyAddress: Address;
  displayName?: string | null;
  isExternal: boolean;
  showQrCode: boolean;
  tokenAddress: Address;
}

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
  const { data } = useTokenQuery({
    variables: { address: tokenAddress },
  });

  if (!data) {
    return null;
  }

  const { token: nativeToken } = data;

  return (
    <>
      {canMintTokens && (
        <div className={styles.container}>
          <span className={styles.colonyName}>
            <Heading
              appearance={{ size: 'medium' }}
              text={MSG.title}
              textValues={{ displayName }}
            />
          </span>
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
            }: FormikProps<{
              mintAmount: number;
            }>) => (
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
                  <span
                    className={styles.nativeToken}
                    title={nativeToken.name || undefined}
                  >
                    {nativeToken.symbol}
                  </span>
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    onClick={() => handleSubmit()}
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
            <p className={styles.qrCodeDescription}>
              <FormattedMessage
                {...MSG[
                  isExternal ? 'qrCodeDescriptionExternal' : 'qrCodeDescription'
                ]}
              />
            </p>
            <CopyableAddress full>{colonyAddress}</CopyableAddress>
          </div>
        </div>
      )}
    </>
  );
};

ColonyInitialFunding.displayName = 'dashboard.ColonyInitialFunding';

export default ColonyInitialFunding;
