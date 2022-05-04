import React, {
  cloneElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  HTMLAttributes,
  MouseEvent,
} from 'react';
import { nanoid } from 'nanoid';
import { usePopper } from 'react-popper';
import { PopperOptions } from 'react-popper-tooltip';

import { Placement } from '@popperjs/core';
import { Unionize } from 'utility-types';

import { SimpleMessageValues } from '~types/index';
import { usePrevious } from '~utils/hooks';

import PopoverWrapper from './PopoverWrapper';
import {
  PopoverAppearanceType,
  PopoverChildFn,
  PopoverContent,
  PopoverTriggerType,
} from './types';

interface PopoverChildFnProps {
  ref: (arg0: HTMLElement | null) => void;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface Props {
  /** Appearance object for styling */
  appearance?: PopoverAppearanceType;
  /** Child element to trigger the popover */
  children: ReactNode | PopoverChildFn;
  /** Popover content */
  content: PopoverContent;
  /** Values for content (react-intl interpolation) */
  contentValues?: SimpleMessageValues;
  /** Set the open state from outside */
  isOpen?: boolean;
  /** Called when Popover closes */
  onClose?: (data?: any, modifiers?: { cancelled: boolean }) => void;
  /** Delay opening of popover for `openDelay` ms */
  openDelay?: number;
  /** Popover placement */
  placement?: Placement;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  popperOptions?: PopperOptions;
  /** Whether the reference element should retain focus when popover is open (only for `HTMLInputElements`) */
  retainRefFocus?: boolean;
  /** Whether there should be an arrow on the popover */
  showArrow?: boolean;
  /** How the popover gets triggered. Won't work when using a render prop as `children` */
  trigger?: PopoverTriggerType;
}

interface AllTriggerProps {
  onClick: () => void;
  onMouseEnter: () => void;
  disabled: null;
}

type ReferenceElementProps = Unionize<AllTriggerProps> &
  Pick<HTMLAttributes<HTMLElement>, 'aria-describedby'> & {
    ref: Dispatch<SetStateAction<HTMLElement>>;
  };

const displayName = 'Popover';

const Popover = ({
  appearance,
  children,
  content,
  contentValues,
  isOpen: isOpenProp = false,
  onClose,
  openDelay,
  placement: placementProp = 'auto',
  popperOptions = {},
  retainRefFocus,
  showArrow = true,
  trigger = 'click',
}: Props) => {
  // Use dangle to encourage use of callbackFn for setting state
  const [isOpen, _setIsOpen] = useState<boolean>(isOpenProp);
  const [referenceElement, setReferenceElement] = useState<Element | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const openTimeoutRef = useRef<number>();
  const { current: elementId } = useRef<string>(nanoid());

  const { attributes, styles, state } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
      placement: placementProp,
      ...popperOptions,
    },
  );

  const lastIsOpenProp = usePrevious(isOpenProp);

  const requestOpen = useCallback(() => {
    if (isOpen) {
      return;
    }
    if (openDelay && window) {
      openTimeoutRef.current = window.setTimeout(() => {
        _setIsOpen(true);
      }, openDelay);
      return;
    }
    _setIsOpen(true);
  }, [isOpen, openDelay]);

  const close = useCallback(
    (data?: any, modifiers?: { cancelled: boolean }) => {
      if (window) {
        window.clearTimeout(openTimeoutRef.current);
      }
      if (!isOpen) return;
      _setIsOpen(false);
      if (typeof onClose == 'function') onClose(data, modifiers);
    },
    [isOpen, onClose],
  );

  const handleWrapperFocus = useCallback(() => {
    if (retainRefFocus && referenceElement instanceof HTMLInputElement) {
      referenceElement.focus();
    }
  }, [referenceElement, retainRefFocus]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover' && referenceElement) {
      close();
    }
  }, [close, referenceElement, trigger]);

  const handleOutsideClick = useCallback(
    (evt: Event) => {
      const targetInRefNode = (refNode: Element | null) => {
        return (
          evt.target instanceof Node && refNode && refNode.contains(evt.target)
        );
      };
      if (targetInRefNode(popperElement) || targetInRefNode(referenceElement)) {
        return;
      }
      close();
    },
    [close, popperElement, referenceElement],
  );

  const ReferenceContent = useMemo<() => ReactElement>(() => {
    if (typeof children === 'function') {
      return () =>
        children({
          ref: setReferenceElement,
          id: elementId,
          isOpen: !!isOpen,
          open: () => requestOpen(),
          close,
          toggle: () => (isOpen ? close() : requestOpen()),
        });
    }
    return () =>
      cloneElement<ReferenceElementProps>(children as ReactElement, {
        'aria-describedby': isOpen ? elementId : undefined,
        ...(typeof (children as any).type === 'function'
          ? {
              innerRef: setReferenceElement,
            }
          : { ref: setReferenceElement }),
        ...(trigger
          ? {
              hover: {
                onMouseOver: requestOpen,
                /*
                 * Current version of React (16.11.0 as of now) does not call `onMouseLeave` for
                 * `disabled` buttons. Thus, we use a native event listener in `componentDidUpdate`.
                 *
                 * However, this may work in future versions.
                 */
                // onMouseLeave: close,
              },
              click: {
                onClick: (event: MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (isOpen) {
                    return close();
                  }
                  return requestOpen();
                },
              },
              disabled: null,
            }[trigger]
          : null),
      });
  }, [children, close, elementId, isOpen, requestOpen, trigger]);

  // Event listeners
  useEffect(() => {
    document.body.addEventListener('click', handleOutsideClick, true);
    /*
     * Incase the `ref` contains a `disabled` button, we need to use the native `mouseleave` event, as React doesn't call `onMouseLeave` for `disabled` buttons.
     * See: https://github.com/facebook/react/issues/4251
     */
    if (referenceElement) {
      referenceElement.addEventListener('mouseout', handleMouseLeave, true);
    }
    return () => {
      if (referenceElement) {
        referenceElement.removeEventListener(
          'mouseleave',
          handleMouseLeave,
          true,
        );
      }
      document.body.removeEventListener('click', handleOutsideClick, true);
    };
  }, [handleMouseLeave, handleOutsideClick, referenceElement]);

  // Keep in sync with parent component
  useEffect(() => {
    if (isOpenProp !== lastIsOpenProp && isOpenProp !== isOpen) {
      if (!isOpen) {
        requestOpen();
      } else {
        close();
      }
      _setIsOpen(!!isOpenProp);
    }
  }, [close, isOpen, isOpenProp, lastIsOpenProp, requestOpen]);

  // Timeouts
  useEffect(() => {
    const currentOpenTimeoutRef = openTimeoutRef && openTimeoutRef.current;
    return () => {
      if (window && currentOpenTimeoutRef) {
        window.clearTimeout(currentOpenTimeoutRef);
      }
    };
  }, []);

  return (
    <>
      <ReferenceContent />
      {isOpen && (
        <PopoverWrapper
          appearance={appearance}
          arrowRef={setArrowElement}
          close={close}
          contentRef={setPopperElement}
          content={content}
          contentValues={contentValues}
          onFocus={handleWrapperFocus}
          popperAttributes={attributes}
          popperStyles={styles}
          retainRefFocus={retainRefFocus}
          showArrow={showArrow}
          state={state}
        />
      )}
    </>
  );
};

Popover.displayName = displayName;

export default Popover;
