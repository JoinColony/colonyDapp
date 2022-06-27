import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import styles from './Dropdown.css';

const displayName = 'UserPickerWithSearch.Dropdown';

interface Props {
  element: HTMLDivElement | null;
  scrollContainer?: Window | HTMLElement | null;
  placement?: 'right' | 'bottom';
  children: React.ReactNode;
}

const Dropdown = ({
  element,
  scrollContainer = window,
  placement = 'right',
  children,
}: Props) => {
  const [posTop, setPosTop] = useState<number | undefined>();

  const left = useMemo(() => {
    const { left: elemLeft, width } = element?.getBoundingClientRect() || {};
    if (placement === 'bottom') {
      return elemLeft || 0;
    }
    return (elemLeft || 0) + (width || 0);
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
          }}
        >
          {children}
        </div>,
        document.body,
      )
    : null;
};

Dropdown.displayName = displayName;

export default Dropdown;
