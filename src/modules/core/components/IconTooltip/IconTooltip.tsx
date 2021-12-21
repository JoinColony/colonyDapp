import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { PopperProps } from 'react-popper';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './IconTooltip.css';

interface Props {
  icon: string;
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
  iconClassName = styles.icon,
  tooltipText,
  tooltipTextValues,
  tooltipPopperProps = {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [123, 10],
        },
      },
    ],
  },
  tooltipClassName = styles.tooltipWrapper,
  className,
  showArrow,
}: Props) => (
  <>
    <div className={className || getMainClasses({}, styles)}>
      <Tooltip
        appearance={{ theme: 'dark', size: 'medium' }}
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
        <div>
          <Icon className={iconClassName} name={icon} title="" />
        </div>
      </Tooltip>
    </div>
  </>
);

IconTooltip.displayName = displayName;

export default IconTooltip;
