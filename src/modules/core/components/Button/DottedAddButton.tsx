import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Button, { Props as ButtonProps } from './Button';
import Icon from '../Icon';

import styles from './DottedAddButton.css';

interface Props extends Omit<ButtonProps, 'appearance'> {
  // Make text required (optional in `ButtonProps`)
  text: MessageDescriptor | string;
}

const displayName = 'Button.DottedAddButton';

const DottedAddButton = ({ text, textValues, ...rest }: Props) => (
  <Button appearance={{ theme: 'dottedArea' }} {...rest}>
    <span className={styles.buttonTextContainer}>
      <div className={styles.buttonIcon}>
        <Icon
          appearance={{ size: 'medium' }}
          name="circle-plus"
          title={text}
          titleValues={textValues}
        />
      </div>
      {typeof text === 'string' ? (
        text
      ) : (
        <FormattedMessage {...text} values={textValues} />
      )}
    </span>
  </Button>
);

DottedAddButton.displayName = displayName;

export default DottedAddButton;
