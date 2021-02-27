import React, { ReactNode } from 'react';

import { Tooltip } from '~core/Popover';

export interface TokenTooltipProps {
  children: ReactNode;
  className: string;
  content: ReactNode;
}

const TokenTooltip = ({ children, className, content }: TokenTooltipProps) => {
  const popperProps = {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 5],
        },
      },
    ],
  };

  return (
    <Tooltip
      darkTheme
      placement="top-start"
      content={content}
      popperProps={popperProps}
    >
      {({ close, open, ref }) => (
        <div
          className={className}
          ref={ref}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {children}
        </div>
      )}
    </Tooltip>
  );
};

export default TokenTooltip;
