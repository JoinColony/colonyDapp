/* @flow */

import type { Node } from 'react';
import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './Heading.css';

const displayName = 'Heading';

type Appearance = {
  theme?: 'primary' | 'dark' | 'invert' | 'uppercase',
  margin?: 'none' | 'small' | 'double',
  size: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge',
  weight?: 'thin' | 'medium' | 'bold',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** String that will hard set the heading element to render */
  tagName?: string,
  /** Used to extend the functionality of the component. This will not generate a title attribute on the element. */
  children?: Node,
  /** A string or a `MessageDescriptor` that make up the headings's text */
  text?: MessageDescriptor | string,
  /** Values for text (react-intl interpolation) */
  textValues?: MessageValues,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const getText = (
  children?: Node,
  text?: MessageDescriptor | string,
  textValues,
  { formatMessage }: IntlShape,
) => {
  if (children) {
    return children;
  }
  if (!text) {
    return '';
  }
  if (typeof text == 'string') {
    return text;
  }
  return formatMessage(text, textValues);
};

const Heading = ({
  appearance = { size: 'huge' },
  children,
  intl,
  tagName,
  text,
  textValues,
  ...props
}: Props) => {
  const { size } = appearance;
  const HeadingElement =
    tagName ||
    {
      huge: 'h1',
      large: 'h2',
      medium: 'h3',
      normal: 'h4',
      small: 'h5',
      tiny: 'h6',
    }[size || 'huge'];
  const value = getText(children, text, textValues, intl);
  return (
    <HeadingElement
      // If `value` is of type `Node` (i.e. children prop), don't add broken title.
      title={typeof value === 'string' ? value : null}
      className={getMainClasses(appearance, styles)}
      {...props}
    >
      {value}
    </HeadingElement>
  );
};

Heading.displayName = displayName;

export default injectIntl(Heading);
