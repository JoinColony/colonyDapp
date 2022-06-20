import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  element: HTMLDivElement | null;
  scrollContainer?: Window | HTMLElement | null;
  children: React.ReactNode;
}

const Dropdown = ({ element, scrollContainer = window, children }: Props) => {
  const [posTop, setPosTop] = useState(element?.getBoundingClientRect()?.top);

  const left = useMemo(() => {
    const { left: elemLeft, width } = element?.getBoundingClientRect() || {};
    return (elemLeft || 0) + (width || 0);
  }, [element]);

  useEffect(() => {
    setPosTop(() => element?.getBoundingClientRect()?.top);
  }, [element]);

  const onScroll = useCallback(() => {
    const top = element?.getBoundingClientRect()?.top;
    setPosTop(top);
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
          style={{
            position: 'absolute',
            top: posTop,
            left,
            width: '332px',
          }}
        >
          {children}
        </div>,
        document.body,
      )
    : null;
};

export default Dropdown;
