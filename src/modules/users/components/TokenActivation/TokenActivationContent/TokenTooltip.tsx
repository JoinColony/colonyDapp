import React, { ReactNode } from 'react';

import { Tooltip } from '~core/Popover';

export interface TokenTooltipProps {
  children: ReactNode;
  className: string;
  content: ReactNode;
  popperOffset?: [number, number];
}

const TokenTooltip = ({
  children,
  className,
  content,
  popperOffset,
}: TokenTooltipProps) => {
  const popperProps = {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: popperOffset || [0, 5],
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
