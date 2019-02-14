/* @flow */

import type { Node as ReactNode } from 'react';
import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';

import React, { Component } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import { injectIntl } from 'react-intl';
import nanoid from 'nanoid';

import type { ReactRef } from './types';

// eslint-disable-next-line import/no-cycle
import PopoverWrapper from './PopoverWrapper.jsx';

export type Placement = 'auto' | 'top' | 'right' | 'bottom' | 'left';

// This might be an eslint hiccup. Don't know where this is unused
// eslint-disable-next-line react/no-unused-prop-types
type RefObj = { ref: ReactRef };

export type Appearance = {
  theme: 'dark' | 'grey',
};

export type PopoverTrigger = ({
  ref: ReactRef,
  id: string,
  isOpen: boolean,
  open: () => void,
  close: () => void,
  toggle: () => void,
}) => ReactNode;

// Left intentionally unsealed (passing props)
export type Props = {
  appearance?: Appearance,
  /** Child element to trigger the popover */
  children: React$Element<*> | PopoverTrigger,
  /** Whether the popover should close when clicking anywhere */
  closeOnOutsideClick?: boolean,
  /** Popover content */
  content:
    | ReactNode
    | MessageDescriptor
    | (({ close: () => void }) => ReactNode),
  /** Values for content (react-intl interpolation) */
  contentValues?: MessageValues,
  /** Set the open state from outside */
  isOpen?: boolean,
  /** Called when Popover closes */
  onClose?: (data?: any, modifiers?: { cancelled: boolean }) => void,
  /** Delay opening of popover for `openDelay` ms */
  openDelay?: number,
  /** Popover placement */
  placement?: Placement,
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  popperProps?: Object,
  /** Whether the reference element should retain focus when popover is open (only for `HTMLInputElements`) */
  retainRefFocus?: boolean,
  /** Whether there should be an arrow on the popover */
  showArrow: boolean,
  /** How the popover gets triggered. Won't work when using a render prop as `children` */
  trigger?: 'hover' | 'click' | 'disabled',
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

type State = {
  isOpen: boolean,
};

class Popover extends Component<Props, State> {
  refNode: ?HTMLElement;

  contentNode: ?HTMLElement;

  id: string;

  openTimeout: TimeoutID;

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
    this.state = {
      isOpen: props.isOpen || false,
    };
  }

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
        isOpen: isOpenProp,
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
      'aria-describedby': ?string,
      innerRef?: ReactRef,
      ref?: ReactRef,
    } = {
      'aria-describedby': isOpen ? id : null,
    };
    if (typeof children.type == 'function') {
      childProps.innerRef = ref;
    } else {
      childProps.ref = ref;
    }
    return Object.assign(
      {},
      childProps,
      trigger
        ? {
            hover: {
              onMouseEnter: this.requestOpen,
              onMouseLeave: this.close,
            },
            click: { onClick: this.toggle },
            disabled: null,
          }[trigger]
        : null,
    );
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

  registerRefNode = (node: ?HTMLElement) => {
    this.refNode = node;
  };

  registerContentNode = (node: ?HTMLElement) => {
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
        children({ ref, id, isOpen, open: requestOpen, close, toggle });
    }
    return ({ ref }: RefObj) =>
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
    // How to tell flow that this can only be a MessageDescriptor in this case?
    // $FlowFixMe - might be related to https://github.com/facebook/flow/issues/4775
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
              // $FlowFixMe see above renderContent
              <PopoverWrapper
                appearance={{ ...appearance, placement }}
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
