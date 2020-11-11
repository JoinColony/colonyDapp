import { MessageDescriptor } from 'react-intl';
import React from 'react';

import ExternalLink from '~core/ExternalLink';
import { SimpleMessageValues } from '~types/index';
import { getBlockExplorerLink } from '~utils/external';

interface Props {
  /*
   * Allows for link style customization (Eg: we need to disquise the link as a button)
   * Don't abuse it!
   */
  className?: string;

  /** Address of the token to link to */
  tokenAddress: string;

  /** A string or a `messageDescriptor` that make up the link's text. Defaults to `tokenAddress`. */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
}

const displayName = 'TokenLink';

const TokenLink = ({ className, tokenAddress, text, textValues }: Props) => (
  <ExternalLink
    className={className}
    href={getBlockExplorerLink({
      linkType: 'token',
      addressOrHash: tokenAddress,
    })}
    text={text || tokenAddress}
    textValues={textValues}
  />
);

TokenLink.displayName = displayName;

export default TokenLink;
