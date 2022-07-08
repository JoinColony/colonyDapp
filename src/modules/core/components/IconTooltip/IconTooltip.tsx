import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';

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
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
  tooltipClassName?: string;
  className?: string;
  iconTitle?: string | MessageDescriptor;
  showArrow?: boolean;
  dataTest?: string;
}

const displayName = 'IconTooltip';

const IconTooltip = ({
  icon,
  appearance = { size: 'medium', theme: 'dark' },
  iconClassName = styles.icon,
  tooltipText,
  tooltipTextValues,
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions = {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 2],
        },
      },
    ],
  },
  tooltipClassName = styles.tooltipWrapper,
  className,
  showArrow,
  dataTest,
}: Props) => (
  <div
    className={cx(getMainClasses(appearance, styles), className)}
    data-test={dataTest}
  >
    <Tooltip
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
      popperOptions={tooltipPopperOptions}
    >
      <Icon className={iconClassName} name={icon} title="" />
    </Tooltip>
  </div>
);

IconTooltip.displayName = displayName;

export default IconTooltip;
