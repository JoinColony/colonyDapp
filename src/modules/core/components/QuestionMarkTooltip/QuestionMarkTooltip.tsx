import React from 'react';
import { PopperProps } from 'react-popper';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ComplexMessageValues } from '~types/index';

const displayName = 'QuestionMarkTooltip';

interface Props {
  tooltipText: string | MessageDescriptor;
  tooltipTextValues?: ComplexMessageValues;
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  tooltipPopperProps?: Omit<PopperProps, 'children'>;
  className?: string;
  tooltipClassName?: string;
  iconTitle?: string;
  showArrow?: boolean;
}

const QuestionMarkTooltip = ({
  iconTitle,
  tooltipClassName,
  tooltipTextValues,
  tooltipPopperProps = {
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
}: Props) => {
  return (
    <>
      <Tooltip
        appearance={{ theme: 'dark' }}
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
        popperProps={tooltipPopperProps}
      >
        <div className={className}>
          <Icon
            name="question-mark"
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
