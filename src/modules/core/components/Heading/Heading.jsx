/* @flow */

import React from 'react';
import type { Node } from 'react';

import { getMainClasses } from '$utils/css';

import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { Appearance } from '$types/css';

import styles from './Heading.css';

const displayName = 'core.Heading';

type Props = {
  appearance?: Appearance,
  className?: string,
  intl: IntlShape,
  tagName?: string,
  children: Node,
  text: MessageDescriptor | string,
  textValues?: { [string]: string },
};

/**
 * Heading Component
 *
 * Setting the `theme` and `size` will determine how the heading looks.
 * They are equivalent to the style names found inside `Heading.css` in the `Themes` and `Sizing` sections.
 *
 * @method Heading
 *
 * @param {string} tagName String that will hard set the heading element to render (default: h3)
 * @param {string} className Overwriting class name(s). Setting this will overwrite appearance defaults.
 * @param {string|MessageDescriptor} text A string or a `MessageDescriptor` that make up the headings's text
 * @param {Object} intl `react-intl` object, so that we have access to the `formatMessage()` method.
 * @param {Node} children Used to extend the functionality of the component. This will not generate a title attribute on the element.
 * @param {Object} props Remaining (custom) props that will be passed down to the `heading` element
 */

// TODO: hoping this style will be fixed by prettier
const Heading = ({ appearance,
  children,
  className,
  intl,
  tagName,
  text,
  textValues,
  ...props
}: Props) => {
  const size = (appearance && appearance.size) || 'medium';
  const HeadingElement = tagName || {
    huge: 'h1',
    thin: 'h1',
    large: 'h2',
    medium: 'h3',
    small: 'h4',
    tiny: 'h5',
  }[size] || 'h3';
  const value = typeof text == 'string' ? text : intl.formatMessage(text, textValues);

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
