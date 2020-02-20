import { MessageDescriptor } from 'react-intl';
import React from 'react';

import { DEFAULT_NETWORK } from '~constants';
import ExternalLink from '~core/ExternalLink';
import { SimpleMessageValues } from '~types/index';
import { getEtherscanLink } from '~utils/external';

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
  textValues?: SimpleMessageValues;
}

const displayName = 'WalletLink';

const WalletLink = ({
  className,
  walletAddress,
  network = DEFAULT_NETWORK,
  text,
  textValues,
}: Props) => (
  <ExternalLink
    className={className}
    href={getEtherscanLink({
      network,
      linkType: 'address',
      addressOrHash: walletAddress,
    })}
    text={text || walletAddress}
    textValues={textValues}
  />
);

WalletLink.displayName = displayName;

export default WalletLink;
