/* @flow */

import type { Node } from 'react';
import type { IntlShape, MessageDescriptor } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';
import { Link as LinkComponent } from 'react-router-dom';

type Props = {
  /** Link children to render inside link */
  children?: Node,
  /** Link to go to (react-router's "to") */
  to: string,
  /** A string or a `messageDescriptor` that make up the button's text label */
  text?: MessageDescriptor | string,
  /** Values for loading text (react-intl interpolation) */
  textValues?: { [string]: any },
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const Link = ({
  children,
  intl: { formatMessage },
  text,
  textValues,
  to,
  ...linkProps
}: Props) => {
  const linkText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <LinkComponent to={to} {...linkProps}>
      {linkText || children}
    </LinkComponent>
  );
};

export default injectIntl(Link);
