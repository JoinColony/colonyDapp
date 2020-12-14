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

  /** Transaction hash */
  hash: string;

  /** A string or a `messageDescriptor` that make up the link's text. Defaults to `hash`. */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;

  /*
   * Show a title over the element, on hover. This is browser native.
   */
  title?: string;
}

const displayName = 'TransactionLink';

const TransactionLink = ({
  className,
  hash,
  text,
  textValues,
  title,
}: Props) => (
  <ExternalLink
    className={className}
    href={getBlockExplorerLink({
      linkType: 'tx',
      addressOrHash: hash,
    })}
    text={text || hash}
    textValues={textValues}
    title={title}
  />
);

TransactionLink.displayName = displayName;

export default TransactionLink;
