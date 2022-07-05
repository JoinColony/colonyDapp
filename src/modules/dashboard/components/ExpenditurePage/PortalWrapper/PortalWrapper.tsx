import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  element: HTMLElement | null;
  children: React.ReactNode;
}

const PortalWrapper = ({ element, children }: Props) => {
  return element ? ReactDOM.createPortal(children, element) : null;
};

export default PortalWrapper;
