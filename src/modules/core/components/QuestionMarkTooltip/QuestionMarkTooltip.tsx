import React from 'react';
import { PopperProps } from 'react-popper';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { SimpleMessageValues } from '~types/index';

const displayName = 'QuestionMarkTooltip';

interface Props {
  tooltipText: string | MessageDescriptor;
  tooltipTextValues?: SimpleMessageValues;
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  tooltipPopperProps?: Omit<PopperProps, 'children'>;
  className?: string;
}

const QuestionMarkTooltip = ({
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
}: Props) => {
  return (
    <>
      <Tooltip
        appearance={{ theme: 'dark' }}
        content={
          typeof tooltipText === 'string' ? (
            tooltipText
          ) : (
            <FormattedMessage {...tooltipText} values={tooltipTextValues} />
          )
        }
        trigger="hover"
        popperProps={tooltipPopperProps}
      >
        <div className={className}>
          <Icon name="question-mark" appearance={{ size: 'small' }} title="" />
        </div>
      </Tooltip>
    </>
  );
};

QuestionMarkTooltip.displayName = displayName;

export default QuestionMarkTooltip;
