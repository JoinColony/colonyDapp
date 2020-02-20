import React from 'react';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import Button, { Props as DefaultButtonProps } from './Button';
import Icon from '~core/Icon';
import { SimpleMessageValues } from '~types/index';
import { useMainClasses } from '~utils/hooks';

import styles from './IconButton.css';

const displayName = 'IconButton';

interface Props extends DefaultButtonProps {
  /** Name of the icon to display */
  icon?: string;
  /** A string or a `messageDescriptor` that make up the button's text label */
  text: MessageDescriptor;
  /** Values for message descriptors */
  textValues?: SimpleMessageValues;
}

const IconButton = ({
  appearance = { theme: 'primary', size: 'medium' },
  icon = 'wallet',
  text,
  textValues,
  /*
   * @NOTE Prevent children from being passed both to this component, or to
   * the underlying `<Button />
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
  ...props
}: Props) => (
  <Button appearance={appearance} {...props} textValues={textValues}>
    <div className={useMainClasses(appearance, styles)}>
      <Icon name={icon} title={text} titleValues={textValues} />
      <FormattedMessage {...text} values={textValues} />
    </div>
  </Button>
);

IconButton.displayName = displayName;

export default IconButton;
