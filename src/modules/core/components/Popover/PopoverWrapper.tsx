import React, { ReactNode, FocusEvent, useMemo } from 'react';
import { PopperArrowProps, PopperProps } from 'react-popper';
import { PopoverAppearanceType } from './types';
import { getMainClasses } from '~utils/css';
import getPopoverArrowClasses from './getPopoverArrowClasses';

import styles from './PopoverWrapper.css';

interface ArrowProps extends PopperArrowProps {
  showArrow: boolean;
}

interface Props {
  appearance?: PopoverAppearanceType;
  arrowProps: ArrowProps;
  children: ReactNode;
  id: string;
  innerRef: (arg0: HTMLElement | null) => void;
  onFocus: (evt: FocusEvent<HTMLElement>) => void;
  retainRefFocus?: boolean;
  placement: PopperProps['placement'];
  style: any;
}

const PopoverWrapper = ({
  appearance: origAppearance,
  arrowProps,
  children,
  id,
  innerRef,
  onFocus,
  placement,
  retainRefFocus,
  style,
}: Props) => {
  const appearance = useMemo(
    () => ({
      ...origAppearance,
      placement,
    }),
    [origAppearance, placement],
  );
  return (
    <div
      className={getMainClasses(appearance, styles, {
        hideArrow: !arrowProps.showArrow,
        showArrow: arrowProps.showArrow,
      })}
      id={id}
      role="tooltip"
      ref={innerRef}
      style={style}
      data-placement={placement}
      tabIndex={retainRefFocus ? -1 : undefined}
      onFocus={onFocus}
    >
      {children}
      <span
        className={getPopoverArrowClasses(appearance, placement, styles)}
        ref={arrowProps.ref}
        style={arrowProps.style}
      />
    </div>
  );
};

export default PopoverWrapper;
