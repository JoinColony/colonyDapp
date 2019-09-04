import React, { ReactNode, Component } from 'react';
import {
  IntlShape,
  MessageDescriptor,
  MessageValues,
  injectIntl,
} from 'react-intl';
import { Manager, Reference, Popper } from 'react-popper';
import nanoid from 'nanoid';

import {
  PopoverAppearanceType,
  PopoverPlacementType,
  PopoverTriggerType,
  ReactRef,
} from './types';
import PopoverWrapper from './PopoverWrapper';

interface RefObj {
  ref: ReactRef;
}

// Left intentionally unsealed (passing props)
export interface Props {
  appearance?: PopoverAppearanceType;

  /** Child element to trigger the popover */
  children: ReactNode | PopoverTriggerType;

  /** Whether the popover should close when clicking anywhere */
  closeOnOutsideClick?: boolean;

  /** Popover content */
  content:
    | ReactNode
    | MessageDescriptor
    | ((arg0: { close: () => void }) => ReactNode);

  /** Values for content (react-intl interpolation) */
  contentValues?: MessageValues;

  /** Set the open state from outside */
  isOpen?: boolean;

  /** Called when Popover closes */
  onClose?: (data?: any, modifiers?: { cancelled: boolean }) => void;

  /** Delay opening of popover for `openDelay` ms */
  openDelay?: number;

  /** Popover placement */
  placement?: PopoverPlacementType;

  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  popperProps?: Record<string, any>;

  /** Whether the reference element should retain focus when popover is open (only for `HTMLInputElements`) */
  retainRefFocus?: boolean;

  /** Whether there should be an arrow on the popover */
  showArrow: boolean;

  /** How the popover gets triggered. Won't work when using a render prop as `children` */
  trigger?: 'hover' | 'click' | 'disabled';

  /** @ignore injected by `react-intl` */
  intl: IntlShape;
}

type State = {
  isOpen: boolean;
};

class Popover extends Component<Props, State> {
  refNode: HTMLElement | null;

  contentNode: HTMLElement | null;

  id: string;

  openTimeout: any;

  static displayName = 'Popover';

  static defaultProps = {
    closeOnOutsideClick: true,
    placement: 'top',
    showArrow: true,
    trigger: 'click',
  };

  constructor(props: Props) {
    super(props);
    this.id = nanoid();
  }

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    isOpen: this.props.isOpen || false,
  };

  // @ts-ignore
  componentDidUpdate(
    { closeOnOutsideClick, isOpen: prevIsOpenProp, trigger },
    { isOpen: prevOpen },
  ) {
    const { isOpen: isOpenProp } = this.props;
    const { isOpen } = this.state;
    if (
      isOpen &&
      !prevOpen &&
      closeOnOutsideClick &&
      document.body &&
      (trigger === 'click' || !trigger)
    ) {
      document.body.addEventListener('click', this.handleOutsideClick, true);
    } else if (!isOpen && prevOpen) {
      this.removeOutsideClickListener();
    }
    if (isOpenProp !== prevIsOpenProp) {
      // We are guarded perfectly fine against this, only when the outside prop changes we change the state as well
      // Maybe there's a better way that I'm not seeing right now
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isOpen: !!isOpenProp,
      });
    }
  }

  componentWillUnmount() {
    this.removeOutsideClickListener();
  }

  removeOutsideClickListener = () => {
    if (document.body) {
      document.body.removeEventListener('click', this.handleOutsideClick, true);
    }
  };

  getChildProps = (ref: ReactRef) => {
    const { id } = this;
    const { children, trigger } = this.props;
    const { isOpen } = this.state;
    const childProps: {
      'aria-describedby': string | null;
      innerRef?: ReactRef;
      ref?: ReactRef;
    } = {
      'aria-describedby': isOpen ? id : null,
    };
    if (typeof (children as any).type == 'function') {
      childProps.innerRef = ref;
    } else {
      childProps.ref = ref;
    }
    return {
      ...childProps,
      ...(trigger
        ? {
            hover: {
              onMouseEnter: this.requestOpen,
              onMouseLeave: this.close,
            },
            click: { onClick: this.toggle },
            disabled: null,
          }[trigger]
        : null),
    };
  };

  handleOutsideClick = (evt: MouseEvent) => {
    if (
      (evt.target instanceof Node &&
        this.contentNode &&
        this.contentNode.contains(evt.target)) ||
      (evt.target instanceof Node &&
        this.refNode &&
        this.refNode.contains(evt.target))
    ) {
      return;
    }
    this.close();
  };

  requestOpen = () => {
    const { isOpen } = this.state;
    const { openDelay } = this.props;
    if (isOpen) {
      return;
    }
    if (openDelay) {
      this.openTimeout = setTimeout(this.open.bind(this), openDelay);
      return;
    }
    this.open();
  };

  open = () => {
    const { isOpen } = this.state;
    if (isOpen) return;
    this.setState({ isOpen: true });
  };

  close = (data?: any, modifiers?: { cancelled: boolean }) => {
    const { onClose } = this.props;
    const { isOpen } = this.state;
    clearTimeout(this.openTimeout);
    if (!isOpen) return;
    this.setState({ isOpen: false });
    if (typeof onClose == 'function') onClose(data, modifiers);
  };

  toggle = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      return this.close();
    }
    return this.requestOpen();
  };

  registerRefNode = (node: HTMLElement | null) => {
    this.refNode = node;
  };

  registerContentNode = (node: HTMLElement | null) => {
    this.contentNode = node;
  };

  handleWrapperFocus = () => {
    const { retainRefFocus } = this.props;
    if (retainRefFocus && this.refNode instanceof HTMLInputElement) {
      this.refNode.focus();
    }
  };

  renderReference = () => {
    const { children } = this.props;
    const { isOpen } = this.state;
    const { id, requestOpen, close, toggle } = this;

    if (typeof children == 'function') {
      return ({ ref }: RefObj) =>
        // @ts-ignore
        children({ ref, id, isOpen, open: requestOpen, close, toggle });
    }
    return ({ ref }: RefObj) =>
      // @ts-ignore
      React.cloneElement(children, this.getChildProps(ref));
  };

  renderContent = () => {
    const {
      content,
      contentValues,
      intl: { formatMessage },
    } = this.props;
    if (typeof content == 'string') {
      return content;
    }
    if (typeof content == 'function') {
      return content({ close: this.close });
    }
    if (React.isValidElement(content)) {
      return content;
    }
    return formatMessage(content, contentValues);
  };

  render() {
    const {
      appearance,
      placement: origPlacement,
      popperProps,
      retainRefFocus,
      showArrow,
    } = this.props;
    const { isOpen } = this.state;
    const content = this.renderContent();
    return (
      <Manager>
        <Reference innerRef={this.registerRefNode}>
          {this.renderReference()}
        </Reference>
        {isOpen && (
          <Popper
            innerRef={this.registerContentNode}
            placement={origPlacement}
            {...popperProps}
          >
            {({ ref, style, placement, arrowProps }) => (
              <PopoverWrapper
                appearance={appearance}
                id={this.id}
                innerRef={ref}
                style={style}
                placement={placement}
                arrowProps={{
                  ...arrowProps,
                  showArrow,
                }}
                onFocus={this.handleWrapperFocus}
                retainRefFocus={retainRefFocus}
              >
                {content}
              </PopoverWrapper>
            )}
          </Popper>
        )}
      </Manager>
    );
  }
}

export default injectIntl(Popover);
