import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';

import styles from './Dropdown.css';

const displayName = 'UserPickerWithSearch.Dropdown';

interface Props {
  element: HTMLDivElement | null;
  scrollContainer?: Window | HTMLElement | null;
  placement?: 'right' | 'bottom' | 'exact'; // 'exact' - portal will appear in the same place element would. Allowing dropdowns with full width to appear in dialogs
  optionSizeLarge?: boolean;
  hasBlueActiveState?: boolean;
  dropdownHeight?: number;
  autoHeight?: boolean;
  children: React.ReactNode;
}

// createPortal is used because of dropdown being cut off - issue: https://github.com/JoinColony/colonyDapp/issues/3488
const Dropdown = React.forwardRef(
  (
    {
      element,
      scrollContainer = window,
      placement = 'right',
      optionSizeLarge,
      dropdownHeight,
      hasBlueActiveState,
      autoHeight,
      children,
    }: Props,
    ref: RefObject<HTMLDivElement>,
  ) => {
    const [posTop, setPosTop] = useState<number | undefined>();
    const [width, setWidth] = useState(332);

    useEffect(() => {
      if (!element) {
        return;
      }
      if (placement !== 'exact') {
        return;
      }
      const rect = element.getBoundingClientRect();
      setWidth(rect.width);
    }, [element, placement]);

    const left = useMemo(() => {
      const { left: elemLeft, width: elemWidth } =
        element?.getBoundingClientRect() || {};
      if (['bottom', 'exact'].includes(placement)) {
        return elemLeft || 0;
      }
      return (elemLeft || 0) + (elemWidth || 0);
    }, [element, placement]);

    const getScrollDimensions = (
      scrollElement: Window | HTMLElement | null,
    ) => {
      if (scrollElement instanceof HTMLElement) {
        return scrollElement.getBoundingClientRect();
      }
      return undefined;
    };

    const onScroll = useCallback(() => {
      const { top: elTop, bottom: elBottom, height: elHeight } =
        element?.getBoundingClientRect() || {};
      const scrollDimentions = getScrollDimensions(scrollContainer);

      if (!elTop || !elBottom || !elHeight) {
        setPosTop(0);
        return;
      }

      if (
        dropdownHeight &&
        scrollDimentions &&
        elTop + dropdownHeight > scrollDimentions.height &&
        elBottom < scrollDimentions.bottom
      ) {
        const difference = elTop + dropdownHeight - scrollDimentions.height;

        const topPosition =
          placement === 'bottom' ? elBottom - difference : elTop - difference;

        setPosTop(topPosition);
        return;
      }

      const topPosition = placement === 'bottom' ? elBottom : elTop;

      setPosTop(topPosition);
    }, [element, scrollContainer, dropdownHeight, placement]);

    useEffect(() => {
      onScroll();

      scrollContainer?.addEventListener('scroll', onScroll, {
        passive: true,
      });

      return () => scrollContainer?.removeEventListener('scroll', onScroll);
    }, [onScroll, scrollContainer]);

    return element
      ? ReactDOM.createPortal(
          <div
            className={classNames(styles.dropdown, {
              [styles.optionSizeLarge]: optionSizeLarge,
              [styles.hasBlueActiveState]: hasBlueActiveState,
              [styles.autoHeight]: autoHeight,
            })}
            style={{
              top: posTop,
              left,
              width,
            }}
            ref={ref}
          >
            {children}
          </div>,
          document.body,
        )
      : null;
  },
);

Dropdown.displayName = displayName;

export default Dropdown;
