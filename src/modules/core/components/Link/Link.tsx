import React, { ReactNode } from 'react';
import {
  IntlShape,
  MessageDescriptor,
  MessageValues,
  injectIntl,
} from 'react-intl';

import { Link as LinkComponent } from 'react-router-dom';

// Left intentionally unsealed (passing props)
interface Props {
  /** Link children to render inside link */
  children?: ReactNode;

  /** Link to go to (react-router's "to") */
  to: string;

  /** A string or a `messageDescriptor` that make up the link's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: MessageValues;

  /** @ignore injected by `react-intl` */
  intl: IntlShape;
}

const Link = ({
  children,
  intl: { formatMessage },
  text,
  textValues,
  to,
  ...linkProps
}: Props) => {
  const linkText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);

  return (
    <LinkComponent to={to} {...linkProps}>
      {linkText || children}
    </LinkComponent>
  );
};

export default injectIntl(Link);
