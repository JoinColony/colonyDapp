/* @flow */

import React, { Component } from 'react';

import type { PopoverTrigger } from '~core/Popover';

import { PopoverProvider, RegisteredPopover } from '~core/Popover';
import GasStationContent from './GasStationContent';

type Props = {
  transactions: Array<*>,
  transactionCount: number,
  children: React$Element<*> | PopoverTrigger,
};

type State = {
  isGasStationOpen: boolean,
};

class GasStationPopover extends Component<Props, State> {
  static displayName = 'users.GasStationPopover';

  static defaultProps = {
    transactionCount: 0,
  };

  state = {
    isGasStationOpen: false,
  };

  componentDidUpdate(prevProps) {
    const { transactionCount: currentTransactionCount = 0 } = prevProps;
    const { transactionCount: newTransactionCount = 0 } = this.props;
    if (newTransactionCount > currentTransactionCount) {
      /*
       * @NOTE We're not causing either an infinite loop,
       * neither copying prop values into state.
       * Eslint's rules a bit draconical here.
       *
       * See: https://reactjs.org/docs/react-component.html#componentdidupdate
       */
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({ isGasStationOpen: true });
    }
  }

  closeGasStation() {
    return this.setState({ isGasStationOpen: false });
  }

  render() {
    const { isGasStationOpen } = this.state;
    const { children, transactions } = this.props;

    return (
      <PopoverProvider>
        <RegisteredPopover
          appearance={{ theme: 'grey' }}
          content={({ close }) => (
            <GasStationContent transactions={transactions} close={close} />
          )}
          name="GasStationPopover"
          placement="bottom"
          showArrow={false}
          isOpen={isGasStationOpen}
          onClose={() => this.closeGasStation()}
        >
          {children}
        </RegisteredPopover>
      </PopoverProvider>
    );
  }
}

export default GasStationPopover;
