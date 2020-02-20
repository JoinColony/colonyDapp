import React, {
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import {
  Manager,
  Reference,
  Popper,
  PopperProps,
  ReferenceChildrenProps,
} from 'react-popper';
import nanoid from 'nanoid';

import { SimpleMessageValues } from '~types/index';

import {
  PopoverAppearanceType,
  PopoverChildFn,
  PopoverTriggerType,
} from './types';
import PopoverWrapper from './PopoverWrapper';
import { usePrevious } from '~utils/hooks';

export interface Props {
  appearance?: PopoverAppearanceType;

  /** Child element to trigger the popover */
  children: ReactNode | PopoverChildFn;

  /** Popover content */
  content:
    | ReactNode
    | MessageDescriptor
    | ((arg0: { close: () => void }) => ReactNode);

  /** Values for content (react-intl interpolation) */
  contentValues?: SimpleMessageValues;

  /** Set the open state from outside */
  isOpen?: boolean;

  /** Called when Popover closes */
  onClose?: (data?: any, modifiers?: { cancelled: boolean }) => void;

  /** Delay opening of popover for `openDelay` ms */
  openDelay?: number;

  /** Popover placement */
  placement?: PopperProps['placement'];

  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  // popperProps?: Record<string, any>;
  popperProps?: PopperProps;

  /** Whether the reference element should retain focus when popover is open (only for `HTMLInputElements`) */
  retainRefFocus?: boolean;

  /** Whether there should be an arrow on the popover */
  showArrow?: boolean;

  /** How the popover gets triggered. Won't work when using a render prop as `children` */
  trigger?: PopoverTriggerType;
}

interface FnChildProps {
  innerRef?: ReferenceChildrenProps['ref'];
}

interface OtherChildrenProps extends HTMLAttributes<HTMLElement> {
  ref?: ReferenceChildrenProps['ref'];
}

type ChildProps = FnChildProps | OtherChildrenProps;

const assignInnerRef = (refNode: MutableRefObject<HTMLElement | undefined>) => (
  ref: HTMLElement,
) => {
  if (ref) {
    // eslint-disable-next-line no-param-reassign
    refNode.current = ref;
  }
};

const displayName = 'Popover';

const Popover = ({
  appearance,
  children,
  content,
  contentValues,
  isOpen: isOpenProp = false,
  onClose,
  openDelay = 0,
  placement: origPlacement = 'top',
  popperProps,
  retainRefFocus,
  showArrow = true,
  trigger = 'click',
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenProp); // when opening please use `requestOpen`

  const contentNode = useRef<HTMLElement>();
  const referenceNode = useRef<HTMLElement>();
  const openTimeoutRef = useRef<number>();
  const { current: elementId } = useRef<string>(nanoid());

  const { formatMessage } = useIntl();

  const lastIsOpenProp = usePrevious(isOpenProp);

  const requestOpen = useCallback(() => {
    if (isOpen) {
      return;
    }
    if (openDelay && window) {
      openTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
      }, openDelay);
      return;
    }
    setIsOpen(true);
  }, [isOpen, openDelay]);

  const close = useCallback(
    (data?: any, modifiers?: { cancelled: boolean }) => {
      if (window) {
        window.clearTimeout(openTimeoutRef.current);
      }
      if (!isOpen) return;
      setIsOpen(false);
      if (typeof onClose == 'function') onClose(data, modifiers);
    },
    [isOpen, onClose, setIsOpen],
  );

  const getChildProps = useCallback(
    (ref: ReferenceChildrenProps['ref']): ChildProps => {
      const childProps: ChildProps = {
        'aria-describedby': isOpen ? elementId : undefined,
      };
      if (typeof (children as any).type == 'function') {
        (childProps as FnChildProps).innerRef = ref;
      } else {
        (childProps as OtherChildrenProps).ref = ref;
      }
      return {
        ...childProps,
        ...(trigger
          ? {
              hover: {
                onMouseEnter: requestOpen,
                /*
                 * Current version of React (16.11.0 as of now) does not call `onMouseLeave` for
                 * `disabled` buttons. Thus, we use a native event listener in `componentDidUpdate`.
                 *
                 * However, this may work in future versions.
                 */
                // onMouseLeave: close,
              },
              click: {
                onClick: () => (isOpen ? close() : requestOpen()),
              },
              disabled: null,
            }[trigger]
          : null),
      };
    },
    [children, close, elementId, isOpen, requestOpen, trigger],
  );

  const handleWrapperFocus = useCallback(() => {
    if (retainRefFocus && referenceNode instanceof HTMLInputElement) {
      referenceNode.focus();
    }
  }, [retainRefFocus]);

  const handleOutsideClick = useCallback(
    (evt: MouseEvent) => {
      const targetInRefNode = (
        refNode: MutableRefObject<HTMLElement | undefined>,
      ) => {
        const currentRefNode = refNode && refNode.current;
        return (
          evt.target instanceof Node &&
          currentRefNode &&
          currentRefNode.contains(evt.target)
        );
      };
      if (targetInRefNode(contentNode) || targetInRefNode(referenceNode)) {
        return;
      }
      close();
    },
    [close],
  );

  const renderContent = useCallback((): ReactNode => {
    if (typeof content == 'string') {
      return content;
    }
    if (typeof content == 'function') {
      return content({ close });
    }
    if (isValidElement(content)) {
      return content;
    }
    return formatMessage(content as MessageDescriptor, contentValues);
  }, [close, content, contentValues, formatMessage]);

  const renderReference = useCallback(() => {
    if (typeof children == 'function') {
      return ({ ref }: ReferenceChildrenProps): PopoverChildFn =>
        children({
          ref,
          id: elementId,
          isOpen: !!isOpen,
          open: () => requestOpen(),
          close,
          toggle: () => (isOpen ? close() : requestOpen()),
        });
    }
    return ({ ref }: ReferenceChildrenProps) =>
      React.cloneElement(children as ReactElement, getChildProps(ref));
  }, [children, close, elementId, getChildProps, isOpen, requestOpen]);

  const handleMouseLeave = useCallback(() => {
    const referenceNodeCurrent = referenceNode.current;
    if (trigger === 'hover' && referenceNodeCurrent) {
      close();
    }
  }, [close, trigger]);

  // Event listeners
  useEffect(() => {
    const referenceNodeCurrent = referenceNode.current;
    document.body.addEventListener('click', handleOutsideClick, true);
    /*
     * Incase the `ref` contains a `disabled` button, we need to use the native `mouseleave` event, as React doesn't call `onMouseLeave` for `disabled` buttons.
     * See: https://github.com/facebook/react/issues/4251
     */
    if (referenceNodeCurrent) {
      referenceNodeCurrent.addEventListener(
        'mouseleave',
        handleMouseLeave,
        true,
      );
    }
    return () => {
      if (referenceNodeCurrent) {
        referenceNodeCurrent.removeEventListener(
          'mouseleave',
          handleMouseLeave,
          true,
        );
      }
      document.body.removeEventListener('click', handleOutsideClick, true);
    };
  }, [handleMouseLeave, handleOutsideClick]);

  // Keep in sync with parent component
  useEffect(() => {
    if (isOpenProp !== lastIsOpenProp && isOpenProp !== isOpen) {
      if (!isOpen) {
        requestOpen();
      } else {
        close();
      }
      setIsOpen(!!isOpenProp);
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
    <Manager>
      <Reference innerRef={assignInnerRef(referenceNode)}>
        {renderReference()}
      </Reference>
      {isOpen && (
        <Popper
          innerRef={assignInnerRef(contentNode)}
          placement={origPlacement}
          {...popperProps}
        >
          {({ ref, style, placement, arrowProps }) => (
            <PopoverWrapper
              appearance={appearance}
              id={elementId}
              innerRef={ref}
              style={style}
              placement={placement}
              arrowProps={{
                ...arrowProps,
                showArrow,
              }}
              onFocus={handleWrapperFocus}
              retainRefFocus={retainRefFocus}
            >
              {renderContent()}
            </PopoverWrapper>
          )}
        </Popper>
      )}
    </Manager>
  );
};

Popover.displayName = displayName;

export default Popover;
