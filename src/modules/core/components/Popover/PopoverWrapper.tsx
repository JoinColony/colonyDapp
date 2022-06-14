import React, {
  CSSProperties,
  Dispatch,
  FocusEvent,
  isValidElement,
  SetStateAction,
  useMemo,
} from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { State as PopperJsState } from '@popperjs/core';
import { useMediaQuery } from 'react-responsive';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import getPopoverArrowClasses from './getPopoverArrowClasses';
import {
  PopoverAppearanceType,
  PopoverContent as PopoverContentType,
} from './types';

import styles from './PopoverWrapper.css';
import { mobile } from '~utils/mediaQueries';

interface Props {
  appearance?: PopoverAppearanceType;
  arrowRef: Dispatch<SetStateAction<HTMLElement | null>>;
  close: () => void;
  content: PopoverContentType;
  contentRef: Dispatch<SetStateAction<HTMLElement | null>>;
  contentValues?: SimpleMessageValues;
  onFocus: (evt: FocusEvent<HTMLElement>) => void;
  popperAttributes: Record<string, object | undefined>;
  popperStyles: Record<string, CSSProperties>;
  retainRefFocus?: boolean;
  showArrow: boolean;
  state: PopperJsState | null;
}

const displayName = 'PopoverWrapper';

const PopoverWrapper = ({
  appearance,
  arrowRef,
  close,
  content,
  contentRef,
  contentValues,
  onFocus,
  popperAttributes,
  popperStyles,
  retainRefFocus,
  showArrow,
  state,
}: Props) => {
  const { formatMessage } = useIntl();
  const popoverContent = useMemo(() => {
    if (typeof content === 'string' || isValidElement(content)) {
      return content;
    }
    if (typeof content === 'function') {
      return content({ close });
    }
    return formatMessage(content as MessageDescriptor, contentValues);
  }, [close, content, contentValues, formatMessage]);

  const isMobile = useMediaQuery({ query: mobile });
  // Ensure popper is aligned correctly on mobile screen
  if (isMobile)
    popperStyles.popper = {
      ...popperStyles.popper,
      transform: 'translate3d(0px, 95.5px, 0px)',
    };

  return (
    <div
      className={`
        popoverWrapper
        ${getMainClasses(appearance, styles, {
          hideArrow: !showArrow,
          showArrow,
        })}
      `}
      onFocus={onFocus}
      ref={contentRef}
      role="tooltip"
      style={popperStyles.popper}
      tabIndex={retainRefFocus ? -1 : undefined}
      {...popperAttributes.popper}
    >
      {popoverContent}
      {state && state.placement && (
        <span
          className={getPopoverArrowClasses(
            appearance,
            // Use placement derived from popperjs so `auto` isn't used
            state.placement,
            styles,
          )}
          ref={arrowRef}
          style={popperStyles.arrow}
        />
      )}
    </div>
  );
};

PopoverWrapper.displayName = displayName;

export default PopoverWrapper;
