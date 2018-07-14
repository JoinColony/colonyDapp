/* @flow */

import type { Node } from 'react';
import type { PopperArrowProps } from 'react-popper';
import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './PopoverWrapper.css';

type Props = {
  appearance: Object,
  arrowProps: PopperArrowProps,
  children: Node,
  id: string,
  innerRef: (?HTMLElement) => void,
  placement: string,
  style: any,
};

const PopoverWrapper = ({
  appearance,
  arrowProps,
  children,
  id,
  innerRef,
  placement,
  style,
}: Props) => (
  <span
    className={getMainClasses(appearance, styles)}
    id={id}
    role="tooltip"
    ref={innerRef}
    style={style}
    data-placement={placement}
  >
    {children}
    <span
      className={styles.arrow}
      ref={arrowProps.ref}
      style={arrowProps.style}
    />
  </span>
);

export default PopoverWrapper;
