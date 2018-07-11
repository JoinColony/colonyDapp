/* @flow */

import type { Node } from 'react';

import React, { Component } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import nanoid from 'nanoid';

import PopoverContent from './PopoverContent.jsx';

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

type Appearance = {
  theme: 'dark',
  placement: Placement,
};

type Props = {
  appearance: Appearance,
  /** Children to trigger the popover */
  children: React$Element<*> | (({ ref: (?HTMLElement) => void }) => Node),
  /** Popover placement */
  placement?: Placement,
};

type State = {
  isOpen: boolean,
};

// Convention: we are using innerRef for all of our components that can be wrapped in popovers
const getChildProps = (children, id, ref) => {
  const props = {};
  if (typeof children.type == 'function') {
    props.innerRef = ref;
  } else {
    props.ref = ref;
  }
  props['aria-describedby'] = id;
  return props;
};

const renderReference = (children, id) => {
  if (typeof children == 'function') {
    return ({ ref }) => children({ ref, id });
  }
  return ({ ref }) =>
    React.cloneElement(children, getChildProps(children, id, ref));
};

class Popover extends Component<Props, State> {
  id: string;

  static defaultProps = {
    placement: 'top',
  };

  constructor(props: Props) {
    super(props);
    this.id = nanoid();
  }

  // state = { isOpen: false };

  render() {
    const { appearance, children, placement: origPlacement } = this.props;
    return (
      <Manager>
        <Reference>{renderReference(children, this.id)}</Reference>
        <Popper placement={origPlacement}>
          {({ ref, style, placement, arrowProps }) => (
            <PopoverContent
              appearance={{ ...appearance, placement }}
              id={this.id}
              innerRef={ref}
              style={style}
              placement={placement}
              arrowProps={arrowProps}
            >
              Popover content!
            </PopoverContent>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
