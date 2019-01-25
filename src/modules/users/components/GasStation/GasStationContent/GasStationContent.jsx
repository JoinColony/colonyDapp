/* @flow */

import React, { Component } from 'react';

import type { TransactionRecord } from '~immutable';

import { getMainClasses } from '~utils/css';

import GasStationHeader from '../GasStationHeader';

import styles from './GasStationContent.css';

type Props = {
  close: () => void,
  transactions: Array<TransactionRecord<*, *>>,
};

type State = {
  txDetailsIdx: number,
};

class GasStationContent extends Component<Props, State> {
  state = {
    // eslint-disable-next-line
     txDetailsIdx: -1,
  };

  render() {
    const { close, transactions } = this.props;
    return (
      <div
        className={getMainClasses({}, styles, {
          isEmpty: transactions.length === 0,
        })}
      >
        <GasStationHeader close={close} />
      </div>
    );
  }
}

export default GasStationContent;
