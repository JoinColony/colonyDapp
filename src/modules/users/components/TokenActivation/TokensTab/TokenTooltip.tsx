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
  const popperOptions = {
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
      placement="top-start"
      content={content}
      popperOptions={popperOptions}
    >
      <div className={className}>{children}</div>
    </Tooltip>
  );
};

export default TokenTooltip;
