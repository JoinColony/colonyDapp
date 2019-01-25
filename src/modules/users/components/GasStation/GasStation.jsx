/* @flow */

import React, { Component } from 'react';

import type { PopoverTrigger } from '~core/Popover';
import type { TransactionRecord } from '~immutable';

import Popover from '~core/Popover';
import GasStationContent from './GasStationContent';

type Props = {
  transactions: Array<TransactionRecord<*, *>>,
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

  componentDidUpdate(prevProps: Props) {
    const { transactions: prevTransactions } = prevProps;
    const { transactions: currentTransactions } = this.props;
    if (
      (prevTransactions && prevTransactions.length) <
      (currentTransactions && currentTransactions.length)
    ) {
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
      <Popover
        appearance={{ theme: 'grey' }}
        content={({ close }) => (
          <GasStationContent transactions={transactions} close={close} />
        )}
        placement="bottom"
        showArrow={false}
        isOpen={isGasStationOpen}
        onClose={() => this.closeGasStation()}
      >
        {children}
      </Popover>
    );
  }
}

export default GasStationPopover;
