import React, { useCallback, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';

import styles from './Dropdown.css';

interface Props {
  element: HTMLDivElement | null;
  scrollContainer?: Window | HTMLElement | null;
  children: React.ReactNode;
}

const Dropdown = ({ element, scrollContainer = window, children }: Props) => {
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    setTop(rect.top);
    setWidth(rect.width);
    setLeft(rect.left);
  }, [element]);

  const onScroll = useCallback(() => {
    if (!element) {
      return;
    }
    setTop(element.getBoundingClientRect().top);
  }, [element]);

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
            top,
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
