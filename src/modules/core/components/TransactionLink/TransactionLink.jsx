/* @flow */

import type { MessageDescriptor, MessageValues } from 'react-intl';

import React from 'react';

import ExternalLink from '~core/ExternalLink';
import { DEFAULT_NETWORK } from '../../constants';

type Props = {|
  /*
   * Allows for link style customization (Eg: we need to disquise the link as a button)
   * Don't abuse it!
   */
  className?: string,
  /** Transaction hash */
  hash: string,
  /** Optionally override current network */
  network?: string,
  /** A string or a `messageDescriptor` that make up the link's text. Defaults to `hash`. */
  text?: MessageDescriptor | string,
  /** Values for text (react-intl interpolation) */
  textValues?: MessageValues,
|};

const displayName = 'TransactionLink';

const TransactionLink = ({
  className,
  hash,
  network = DEFAULT_NETWORK,
  text,
  textValues,
}: Props) => {
  const linkText = text || hash;
  const tld = network === 'tobalaba' ? 'com' : 'io';
  const networkSubdomain = network === 'homestead' ? '' : `${network}.`;
  const href = `https://${networkSubdomain}etherscan.${tld}/tx/${hash}`;
  return (
    <ExternalLink
      className={className}
      href={href}
      text={linkText}
      textValues={textValues}
    />
  );
};

TransactionLink.displayName = displayName;

export default TransactionLink;
