/* @flow */

import type { Node } from 'react';

import React, { Component, Fragment } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import nanoid from 'nanoid';

import type { ReactRef } from './types';
import styles from './Popover.css';

import PopoverWrapper from './PopoverWrapper.jsx';

export type Placement =
  | 'auto'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'right-start'
  | 'top-start'
  | 'left-start'
  | 'top-end'
  | 'right-end'
  | 'top-end'
  | 'left-end';

// This might be an eslint hiccup. Don't know where this is unused
// eslint-disable-next-line react/no-unused-prop-types
type RefObj = { ref: ReactRef };

type Appearance = {
  theme: 'dark',
  placement: Placement,
};

type Props = {
  appearance?: Appearance,
  /** Child element to trigger the popover */
  children: React$Element<*> | (({ ref: ReactRef }) => Node),
  /** Whether the popover should close when clicking anywhere */
  closeOnBackdropClick?: boolean,
  /** Popover placement */
  placement?: Placement,
  /** How the popover gets triggered */
  trigger: 'always' | 'hover' | 'click' | 'disabled',
};

type State = {
  isOpen: boolean,
};

class Popover extends Component<Props, State> {
  backdropNode: HTMLElement;

  id: string;

  static defaultProps = {
    closeOnBackdropClick: true,
    placement: 'top',
    trigger: 'hover',
  };

  constructor(props: Props) {
    super(props);
    this.id = nanoid();
    this.state = {
      isOpen: props.trigger === 'always',
    };
  }

  getChildProps = (ref: ReactRef) => {
    const { id } = this;
    const { children, trigger } = this.props;
    const childProps: {
      'aria-describedby': string,
      innerRef?: ReactRef,
      ref?: ReactRef,
    } = {
      'aria-describedby': id,
    };
    if (typeof children.type == 'function') {
      childProps.innerRef = ref;
    } else {
      childProps.ref = ref;
    }
    return Object.assign(
      {},
      childProps,
      {
        hover: {
          onMouseEnter: this.open,
          onMouseLeave: this.close,
        },
        click: { onClick: this.toggle },
        disabled: null,
        always: null,
      }[trigger],
    );
  };

  open = () => {
    this.setState({ isOpen: true }, () => {
      if (this.backdropNode) this.backdropNode.focus();
    });
  };

  close = () => this.setState({ isOpen: false });

  toggle = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      return this.close();
    }
    return this.open();
  };

  handleBackdropRef = (node: ?HTMLElement) => {
    if (node) this.backdropNode = node;
  };

  handleBackdropKey = ({ key }: SyntheticKeyboardEvent<HTMLElement>) => {
    if (key === 'Escape') {
      this.close();
    }
  };

  renderReference = () => {
    const { children } = this.props;
    const { id, open, close, toggle } = this;

    if (typeof children == 'function') {
      return ({ ref }: RefObj) => children({ ref, id, open, close, toggle });
    }
    return ({ ref }: RefObj) =>
      React.cloneElement(children, this.getChildProps(ref));
  };

  render() {
    const {
      appearance,
      closeOnBackdropClick,
      placement: origPlacement,
      trigger,
    } = this.props;
    const { isOpen } = this.state;
    return (
      <Manager>
        <Reference>{this.renderReference()}</Reference>
        {isOpen && (
          <Fragment>
            {closeOnBackdropClick && (trigger === 'click' || !trigger) ? (
              <div
                tabIndex="-1"
                role="button"
                ref={this.handleBackdropRef}
                className={styles.backdrop}
                onClick={this.close}
                onKeyUp={this.handleBackdropKey}
                aria-label="Close"
              />
            ) : null}
            <Popper placement={origPlacement}>
              {({ ref, style, placement, arrowProps }) => (
                <PopoverWrapper
                  appearance={{ ...appearance, placement }}
                  id={this.id}
                  innerRef={ref}
                  style={style}
                  placement={placement}
                  arrowProps={arrowProps}
                >
                  Popover content!
                </PopoverWrapper>
              )}
            </Popper>
          </Fragment>
        )}
      </Manager>
    );
  }
}

export default Popover;
