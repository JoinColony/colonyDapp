/* @flow */

import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import styles from './ExternalLink.css';

type Props = {|
  /** The page it should link to */
  href: string,
  /** A string or a `messageDescriptor` that make up the link's text */
  text?: MessageDescriptor | string,
  /** Values for text (react-intl interpolation) */
  textValues?: MessageValues,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
  /*
   * Allows for link style customization (Eg: we need to disquise the link as a button)
   * Don't abuse it!
   */
  className?: string,
|};

const ExternalLink = ({
  href,
  text,
  textValues,
  intl: { formatMessage },
  className,
}: Props) => {
  // eslint-disable-next-line max-len
  const typeOfText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);
  const linkText = typeOfText || href;
  return (
    <a
      className={className || styles.main}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {linkText}
    </a>
  );
};

export default injectIntl(ExternalLink);
