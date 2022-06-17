import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import styles from './Dropdown.css';

interface Props {
  element: HTMLDivElement | null;
  scrollContainer?: Window | HTMLElement | null;
  placement?: 'right' | 'bottom' | 'exact'; // 'exact' - portal will appear in the same place element would. Allowing dropdowns with full width to appear in dialogs
  children: React.ReactNode;
}

const Dropdown = ({
  element,
  scrollContainer = window,
  placement = 'right',
  children,
}: Props) => {
  const [posTop, setPosTop] = useState<number | undefined>();
  const [width, setWidth] = useState(332);

  useEffect(() => {
    if (!element) {
      return;
    }
    if (placement !== 'exact') {
      return;
    }
    const rect = element.getBoundingClientRect();
    setWidth(rect.width);
  }, [element, placement]);

  const left = useMemo(() => {
    const { left: elemLeft, width: elemWidth } =
      element?.getBoundingClientRect() || {};
    if (['bottom', 'exact'].includes(placement)) {
      return elemLeft || 0;
    }
    return (elemLeft || 0) + (elemWidth || 0);
  }, [element, placement]);

  const onScroll = useCallback(() => {
    const elementDimentions = element?.getBoundingClientRect();
    if (!elementDimentions) {
      setPosTop(0);
      return;
    }
    const topPosition =
      placement === 'bottom'
        ? elementDimentions.top + elementDimentions.height
        : elementDimentions.top;

    setPosTop(topPosition);
  }, [element, placement]);

  useEffect(() => {
    onScroll();

    scrollContainer?.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => scrollContainer?.removeEventListener('scroll', onScroll);
  }, [onScroll, scrollContainer]);

  return element
    ? ReactDOM.createPortal(
        <div
          className={styles.dropdown}
          style={{
            top: posTop,
            left,
            width,
          }}
        >
          {children}
        </div>,
        document.body,
      )
    : null;
};

export default Dropdown;
