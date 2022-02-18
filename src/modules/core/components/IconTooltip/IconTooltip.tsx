import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { PopperProps } from 'react-popper';
import cx from 'classnames';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './IconTooltip.css';

export interface Appearance {
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'massive';
  theme?: 'dark' | 'grey'; // Used for styling the tooltip theme
}

interface Props {
  icon: string;
  /** Appearance object */
  appearance?: Appearance;
  iconClassName?: string;
  /** Customise the tooltip message */
  tooltipText: string | MessageDescriptor;
  tooltipTextValues?: SimpleMessageValues;
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  tooltipPopperProps?: Omit<PopperProps, 'children'>;
  tooltipClassName?: string;
  className?: string;
  iconTitle?: string;
  showArrow?: boolean;
}

const displayName = 'IconTooltip';

const IconTooltip = ({
  icon,
  appearance = { size: 'medium', theme: 'dark' },
  iconClassName = styles.icon,
  tooltipText,
  tooltipTextValues,
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  tooltipPopperProps = {
    placement: 'top',
  },
  tooltipClassName = styles.tooltipWrapper,
  className,
  showArrow,
}: Props) => (
  <div className={cx(getMainClasses(appearance, styles), className)}>
    <Tooltip
      appearance={{ theme: appearance.theme, size: 'medium' }}
      content={
        typeof tooltipText === 'string' ? (
          tooltipText
        ) : (
          <div className={tooltipClassName}>
            <FormattedMessage {...tooltipText} values={tooltipTextValues} />
          </div>
        )
      }
      trigger="hover"
      showArrow={showArrow}
      popperProps={tooltipPopperProps}
    >
      <div className={styles.iconWrap}>
        <Icon className={iconClassName} name={icon} title="" />
      </div>
    </Tooltip>
  </div>
);

IconTooltip.displayName = displayName;

export default IconTooltip;
