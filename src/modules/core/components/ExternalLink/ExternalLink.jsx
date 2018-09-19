/* @flow */

import type { IntlShape, MessageDescriptor } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import styles from './ExternalLink.css';

type Props = {
  /** The page it should link to */
  href: string,
  /** A string or a `messageDescriptor` that make up the link's text */
  text: MessageDescriptor | string,
  /** Values for loading text (react-intl interpolation) */
  textValues?: { [string]: any },
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const ExternalLink = ({
  href,
  text,
  textValues,
  intl: { formatMessage },
}: Props) => {
  const linkText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);
  return (
    <a
      className={styles.main}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {linkText}
    </a>
  );
};

export default injectIntl(ExternalLink);
