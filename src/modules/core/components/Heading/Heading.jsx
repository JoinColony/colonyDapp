/* @flow */

import React from 'react';
import type { Node } from 'react';

import { getMainClasses } from '~utils/css';

import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { Appearance } from '~types/css';

import styles from './Heading.css';

const displayName = 'core.Heading';

type Props = {
  appearance?: Appearance,
  className?: string, // Overwriting class name(s). Setting this will overwrite appearance defaults.
  intl: IntlShape, // `react-intl` object, so that we have access to the `formatMessage()` method.
  tagName?: string, // String that will hard set the heading element to render (default: h3)
  children: Node, // Used to extend the functionality of the component. This will not generate a title attribute on the element.
  text: MessageDescriptor | string, // A string or a `MessageDescriptor` that make up the headings's text
  textValues?: { [string]: string }, // Values to interpolate in react-intl
};

// TODO: hoping this style will be fixed by prettier
const Heading = ({
  appearance,
  children,
  className,
  intl,
  tagName,
  text,
  textValues,
  ...props
}: Props) => {
  const size = (appearance && appearance.size) || 'medium';
  const HeadingElement =
    tagName ||
    {
      huge: 'h1',
      thin: 'h1',
      large: 'h2',
      mediumL: 'h6',
      medium: 'h3',
      small: 'h4',
      tiny: 'h5',
    }[size] ||
    'h3';
  const value =
    typeof text == 'string' ? text : intl.formatMessage(text, textValues);

  return (
    <HeadingElement
      title={value}
      className={className || getMainClasses(appearance, styles)}
      {...props}
    >
      {value || children}
    </HeadingElement>
  );
};

Heading.displayName = displayName;

export default Heading;
