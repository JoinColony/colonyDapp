import React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import {
  Link as LinkComponent,
  LinkProps as LinkComponentProps,
} from 'react-router-dom';

import { SimpleMessageValues } from '~types/index';

interface Props extends LinkComponentProps {
  /** A string or a `messageDescriptor` that make up the link's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
}

const Link = ({ children, text, textValues, ...linkProps }: Props) => {
  const { formatMessage } = useIntl();

  const linkText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);

  return <LinkComponent {...linkProps}>{linkText || children}</LinkComponent>;
};

export default Link;
