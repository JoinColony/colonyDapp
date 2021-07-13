import { MessageDescriptor, useIntl } from 'react-intl';
import React, { ReactNode } from 'react';

import { SimpleMessageValues } from '~types/index';

import styles from './ExternalLink.css';

interface Props {
  /** Render a react-node into the link */
  children?: ReactNode;

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

  /*
   * Show a title over the element, on hover. This is browser native.
   */
  title?: string;
  download?: string | boolean;
}

const ExternalLink = ({
  children,
  href,
  text,
  textValues,
  className,
  title,
  download,
}: Props) => {
  const { formatMessage } = useIntl();
  // eslint-disable-next-line max-len
  const typeOfText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);
  const linkText = children || typeOfText || href;
  return (
    <a
      className={className || styles.main}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={title}
      {...(download !== undefined ? { download } : {})}
    >
      {linkText}
    </a>
  );
};

export default ExternalLink;
