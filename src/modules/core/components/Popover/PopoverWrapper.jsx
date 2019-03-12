/* @flow */

import type { Node } from 'react';
import type { PopperArrowProps } from 'react-popper';
import React from 'react';

import type { PopoverAppearanceType, PopoverPlacementType } from './types';

import { getMainClasses } from '~utils/css';
import getPopoverArrowClasses from './getPopoverArrowClasses';

import styles from './PopoverWrapper.css';

type Appearance = PopoverAppearanceType & {
  placement?: PopoverPlacementType,
};

type ArrowProps = PopperArrowProps & {
  showArrow: boolean,
};

type Props = {|
  appearance?: Appearance,
  arrowProps: ArrowProps,
  children: Node,
  id: string,
  innerRef: (?HTMLElement) => void,
  onFocus: (evt: SyntheticFocusEvent<HTMLElement>) => void,
  retainRefFocus?: boolean,
  placement: string,
  style: any,
|};

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
    tabIndex={retainRefFocus ? '-1' : null}
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
