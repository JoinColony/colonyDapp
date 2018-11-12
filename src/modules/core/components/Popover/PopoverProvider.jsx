/* @flow */

import type { Node } from 'react';

import React, { Component } from 'react';
import { Set as ImmutableSet } from 'immutable';

const { Provider, Consumer: ContextConsumer } = React.createContext({});

type Props = {
  children: Node,
};

type State = {
  registeredPopovers: ImmutableSet<string>,
};

class PopoverProvider extends Component<Props, State> {
  static displayName = 'PopoverProvider';

  state = {
    registeredPopovers: new ImmutableSet(),
  };

  openPopover = (popoverName: string) => {
    this.setState(({ registeredPopovers }) => ({
      registeredPopovers: registeredPopovers.add(popoverName),
    }));
  };

  closePopover = (popoverName: string) => {
    this.setState(({ registeredPopovers }) => ({
      registeredPopovers: registeredPopovers.delete(popoverName),
    }));
  };

  render() {
    const { children } = this.props;
    const { registeredPopovers } = this.state;
    return (
      <Provider
        value={{
          openPopover: this.openPopover,
          closePopover: this.closePopover,
          registeredPopovers,
        }}
      >
        {children}
      </Provider>
    );
  }
}

export default PopoverProvider;

export const Consumer = ContextConsumer;
