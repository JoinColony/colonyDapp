/* @flow */

import React, { Component } from 'react';

import Popover from '~core/Popover';

import type { PopoverTrigger } from '~core/Popover';
import type { TransactionGroup } from './transactionGroup';

import { transactionCount } from './transactionGroup';
import GasStationContent from './GasStationContent';

type Props = {|
  transactionGroups: Array<TransactionGroup>,
  children: React$Element<*> | PopoverTrigger,
|};

type State = {|
  isGasStationOpen: boolean,
|};

class GasStationPopover extends Component<Props, State> {
  static displayName = 'users.GasStation.GasStationPopover';

  state = {
    isGasStationOpen: false,
  };

  componentDidUpdate(prevProps: Props) {
    const { transactionGroups: prevTransactionGroups } = prevProps;
    const { transactionGroups: currentTransactionGroups } = this.props;
    if (
      transactionCount(prevTransactionGroups) <
      transactionCount(currentTransactionGroups)
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
    const { children, transactionGroups } = this.props;
    return (
      <Popover
        appearance={{ theme: 'grey' }}
        content={({ close }) => (
          <GasStationContent
            transactionGroups={transactionGroups}
            close={close}
          />
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
