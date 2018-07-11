/* @flow */

import React, { Component } from 'react';
import { Manager, Reference, Popper } from 'react-popper';

type Props = {
  children: React$Element<*> | Function,
};

type State = {
  isOpen: boolean,
};

// Convention: we are using innerRef for all of our components that can be wrapped in popovers
const getRefProps = (children, ref) =>
  typeof children.type == 'function' ? { innerRef: ref } : { ref };

const renderReference = children => {
  if (typeof children == 'function') {
    return children;
  }
  return ({ ref }) => React.cloneElement(children, getRefProps(children, ref));
};

class Popover extends Component<Props, State> {
  // state = { isOpen: false };

  render() {
    const { children } = this.props;
    return (
      <Manager>
        <Reference>{renderReference(children)}</Reference>
        <Popper placement="right">
          {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} style={style} data-placement={placement}>
              Popper element
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
