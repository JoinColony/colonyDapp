import { MessageDescriptor, useIntl } from 'react-intl';
import React from 'react';

import { SimpleMessageValues } from '~types/index';

import styles from './ExternalLink.css';

interface Props {
  /** The page it should link to */
  href: string;

  /** A string or a `messageDescriptor` that make up the link's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;

  /*
   * Allows for link style customization (Eg: we need to disquise the link as a button)
   * Don't abuse it!
   */
  className?: string;
}

const ExternalLink = ({ href, text, textValues, className }: Props) => {
  const { formatMessage } = useIntl();
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

export default ExternalLink;
