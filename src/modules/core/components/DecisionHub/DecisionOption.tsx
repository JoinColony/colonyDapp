import React, { ButtonHTMLAttributes, useCallback } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';
import { useField } from 'formik';

import { LinkProps } from 'react-router-dom';
import { getMainClasses } from '~utils/css';
import Icon from '../Icon';
import Link from '../Link';
import { Tooltip } from '../Popover';
import Heading from '../Heading';
import styles from './DecisionOption.css';

const MSG = defineMessages({
  iconTitle: {
    id: 'DecisionOption.iconTitle',
    defaultMessage: 'Choose this option',
  },
});

export interface DecisionOptionType {
  value: string | null;
  title: MessageDescriptor | string;
  subtitle: MessageDescriptor | string;
  icon?: string;
  tooltip?: MessageDescriptor;
  disabled?: boolean;
  dataTest?: string;
}

interface Appearance {
  theme?: 'alt';
}

interface Props {
  appearance?: Appearance;
  option: DecisionOptionType;
  link?: string;
  name: string;
}

const displayName = 'DecisionOption';

const DecisionOptionIcon = ({ icon, tooltip, title }: Props['option']) => {
  if (icon) {
    // Wrap the icon in a Tooltip wrapper only if the tooltip property exists
    return tooltip ? (
      <Tooltip
        placement="left"
        trigger="hover"
        content={
          <span className={styles.tooltip}>
            <FormattedMessage {...tooltip} />
          </span>
        }
      >
        <div className={styles.rowIcon}>
          <Icon name={icon} title={title} appearance={{ size: 'small' }} />
        </div>
      </Tooltip>
    ) : (
      <div className={styles.rowIcon}>
        <Icon name={icon} title={title} />
      </div>
    );
  }
  return null;
};

const DecisionOption = ({
  appearance,
  name,
  option: { title, subtitle, disabled, value },
  option,
  link,
}: Props) => {
  const [, , { setValue }] = useField(name);
  const makeDecision = useCallback(() => {
    if (!disabled && value && setValue) setValue(value);
  }, [setValue, value, disabled]);

  const Element = link ? Link : 'button';
  const elmProps = link
    ? ({ to: disabled ? '' : link } as LinkProps)
    : ({
        onClick: makeDecision,
        disabled,
        type: 'submit',
      } as ButtonHTMLAttributes<HTMLButtonElement>);

  return (
    <Element
      className={getMainClasses(appearance, styles, { disabled: !!disabled })}
      {...(elmProps as any)}
      data-test={option.dataTest}
    >
      <DecisionOptionIcon {...option} />
      <div className={styles.rowContent}>
        <Heading
          appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
          text={title}
        />
        <Heading
          appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
          text={subtitle}
        />
      </div>
      <Icon name="caret-right" title={MSG.iconTitle} />
    </Element>
  );
};

DecisionOption.displayName = displayName;

export default DecisionOption;
