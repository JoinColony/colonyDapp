import React, { ReactNode, FocusEvent } from 'react';
import { PopperArrowProps } from 'react-popper';
import { PopoverAppearanceType, PopoverPlacementType } from './types';
import { getMainClasses } from '~utils/css';
import getPopoverArrowClasses from './getPopoverArrowClasses';

import styles from './PopoverWrapper.css';

interface Appearance extends PopoverAppearanceType {
  placement?: PopoverPlacementType;
}

interface ArrowProps extends PopperArrowProps {
  showArrow: boolean;
}

interface Props {
  appearance?: Appearance;
  arrowProps: ArrowProps;
  children: ReactNode;
  id: string;
  innerRef: (arg0: HTMLElement | null) => void;
  onFocus: (evt: FocusEvent<HTMLElement>) => void;
  retainRefFocus?: boolean;
  placement: string;
  style: any;
}

const PopoverWrapper = ({
  appearance,
  arrowProps,
  children,
  id,
  innerRef,
  onFocus,
  placement,
  retainRefFocus,
  style,
}: Props) => (
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
    tabIndex={retainRefFocus ? -1 : null}
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

export default PopoverWrapper;
