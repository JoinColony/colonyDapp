import React, { HTMLAttributes, ReactNode, useMemo } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './Heading.css';

const displayName = 'Heading';

export type Appearance = {
  theme?: 'primary' | 'dark' | 'invert' | 'uppercase' | 'grey';
  margin?: 'none' | 'small' | 'double';
  size: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge';
  weight?: 'thin' | 'medium' | 'bold';
};

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  /** Appearance object */
  appearance?: Appearance;

  /** String that will hard set the heading element to render */
  tagName?: string;

  /** Used to extend the functionality of the component. This will not generate a title attribute on the element. */
  children?: ReactNode;

  /** A string or a `MessageDescriptor` that make up the headings's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
}

const Heading = ({
  appearance = { size: 'huge' },
  children,
  tagName,
  text,
  textValues,
  ...props
}: Props) => {
  const { formatMessage } = useIntl();
  const { size } = appearance;
  const HeadingElement: any =
    tagName ||
    {
      huge: 'h1',
      large: 'h2',
      medium: 'h3',
      normal: 'h4',
      small: 'h5',
      tiny: 'h6',
    }[size || 'huge'];
  const value = useMemo(() => {
    if (children) {
      return children;
    }
    if (!text) {
      return '';
    }
    if (typeof text === 'string') {
      return text;
    }
    return formatMessage(text, textValues);
  }, [children, formatMessage, text, textValues]);
  return (
    <HeadingElement // If `value` is of type `Node` (i.e. children prop), don't add broken title.
      title={typeof value === 'string' ? value : null}
      className={getMainClasses(appearance, styles)}
      {...props}
    >
      {value}
    </HeadingElement>
  );
};

Heading.displayName = displayName;

export default Heading;
