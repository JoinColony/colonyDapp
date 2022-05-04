import React, { ReactNode } from 'react';
import {
  usePopperTooltip,
  TriggerType,
  PopperOptions,
} from 'react-popper-tooltip';
import { Placement as PlacementType } from '@popperjs/core';

import styles from './Tooltip.css';

interface Props {
  /** Child element to trigger the popover */
  children: ReactNode;

  /** The tooltips' content */
  content: ReactNode;

  /** How the popover gets triggered */
  trigger?: TriggerType | TriggerType[] | null;

  /** The tooltips' placement */
  placement?: PlacementType;

  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  popperOptions?: PopperOptions;

  /** Whether there should be an arrow on the tooltip */
  showArrow?: boolean;

  /** Set the open state from outside */
  isOpen?: boolean;
}

const Tooltip = ({
  children,
  content,
  placement = 'top',
  popperOptions,
  showArrow = true,
  trigger = 'hover',
  isOpen,
}: Props) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    {
      delayShow: 200,
      placement,
      trigger: content ? trigger : null,
      visible: isOpen,
    },
    popperOptions,
  );

  return (
    <>
      <span ref={setTriggerRef}>{children}</span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: styles.tooltipContainer })}
        >
          <div
            {...getArrowProps({
              className: showArrow ? styles.tooltipArrow : '',
            })}
          />
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
