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
  isMobile?: boolean;
}

type IconProps = Props['option'] & {
  isMobile?: boolean;
};

const displayName = 'DecisionOption';

const DecisionOptionIcon = ({
  icon,
  tooltip,
  title,
  isMobile = false,
}: IconProps) => {
  const popperOptions = isMobile
    ? {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [118, 0],
            },
          },
        ],
      }
    : undefined;

  if (icon) {
    // Wrap the icon in a Tooltip wrapper only if the tooltip property exists
    return tooltip ? (
      <Tooltip
        placement={isMobile ? 'bottom' : 'left'}
        trigger={isMobile ? 'click' : 'hover'}
        content={
          <span className={styles.tooltip}>
            <FormattedMessage {...tooltip} />
          </span>
        }
        popperOptions={popperOptions}
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
  isMobile = false,
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
    <div className={styles.wrapper}>
      {isMobile && <DecisionOptionIcon {...option} isMobile />}
      <Element
        className={getMainClasses(appearance, styles, { disabled: !!disabled })}
        {...(elmProps as any)}
        data-test={option.dataTest}
      >
        {!isMobile && <DecisionOptionIcon {...option} />}
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
    </div>
  );
};

DecisionOption.displayName = displayName;

export default DecisionOption;
