import React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  element: HTMLDivElement | null;
  children: React.ReactNode;
}

const Dropdown = ({ element, children }: Props) => {
  const pos = element?.getBoundingClientRect();

  const child = (
    <div
      style={{
        position: 'absolute',
        top: pos?.top,
        left: '400px',
        width: '332px',
      }}
    >
      {children}
    </div>
  );

  return element ? ReactDOM.createPortal(child, document.body) : null;
};

export default Dropdown;
