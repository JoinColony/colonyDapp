import { MessageDescriptor, MessageValues } from 'react-intl';
import React from 'react';

import ExternalLink from '~core/ExternalLink';
import { DEFAULT_NETWORK } from '../../constants';

interface Props {
  /*
   * Allows for link style customization (Eg: we need to disquise the link as a button)
   * Don't abuse it!
   */
  className?: string;

  /** Wallet address */
  walletAddress: string;

  /** Optionally override current network */
  network?: string;

  /** A string or a `messageDescriptor` that make up the link's text. Defaults to `hash`. */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: MessageValues;
}

const displayName = 'WalletLink';

const WalletLink = ({
  className,
  walletAddress,
  network = DEFAULT_NETWORK,
  text,
  textValues,
}: Props) => {
  const linkText = text || walletAddress;
  const tld = network === 'tobalaba' ? 'com' : 'io';
  const networkSubdomain =
    network === 'homestead' || network === 'mainnet' ? '' : `${network}.`;
  // eslint-disable-next-line max-len
  const href = `https://${networkSubdomain}etherscan.${tld}/address/${walletAddress}`;
  return (
    <ExternalLink
      className={className}
      href={href}
      text={linkText}
      textValues={textValues}
    />
  );
};

WalletLink.displayName = displayName;

export default WalletLink;
