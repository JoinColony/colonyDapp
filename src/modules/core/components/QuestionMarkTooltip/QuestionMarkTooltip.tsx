import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ComplexMessageValues } from '~types/index';

const displayName = 'QuestionMarkTooltip';

interface Props {
  tooltipText: string | MessageDescriptor;
  tooltipTextValues?: ComplexMessageValues;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
  className?: string;
  tooltipClassName?: string;
  iconTitle?: string;
  showArrow?: boolean;
  invertedIcon?: boolean;
}

const QuestionMarkTooltip = ({
  iconTitle,
  tooltipClassName,
  tooltipTextValues,
  tooltipPopperOptions = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-3, 10],
        },
      },
    ],
  },
  tooltipText,
  className,
  showArrow,
  invertedIcon,
}: Props) => {
  return (
    <>
      <Tooltip
        content={
          typeof tooltipText === 'string' ? (
            tooltipText
          ) : (
            <div className={tooltipClassName}>
              <FormattedMessage {...tooltipText} values={tooltipTextValues} />
            </div>
          )
        }
        trigger="hover"
        showArrow={showArrow}
        popperOptions={tooltipPopperOptions}
      >
        <div className={className}>
          <Icon
            name={invertedIcon ? 'question-mark-inverted' : 'question-mark'}
            appearance={{ size: 'small' }}
            title={iconTitle || ''}
          />
        </div>
      </Tooltip>
    </>
  );
};

QuestionMarkTooltip.displayName = displayName;

export default QuestionMarkTooltip;
