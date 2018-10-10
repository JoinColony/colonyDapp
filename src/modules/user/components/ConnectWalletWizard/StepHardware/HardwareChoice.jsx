/* @flow */

import React, { Component, Fragment } from 'react';

import { FormattedNumber } from 'react-intl';

import styles from './HardwareChoice.css';

import Radio from '~core/Fields/Radio';
import SpinnerLoader from '~core/Preloaders/SpinnerLoader.jsx';

type Props = {
  checked: boolean,
  wallet: string,
  searchTerm: string,
};

type State = {
  isLoading: boolean,
};

const addressCharPaddingIndices = [5, 38];

class HardwareChoice extends Component<Props, State> {
  timerHandle: TimeoutID; // for mocking balance lookup, so can clearTimeout in `componentWillUnmount`

  state = {
    isLoading: true,
  };

  componentDidMount() {
    this.getWalletBalance();
  }

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  getWalletBalance = () => {
    const timeout = Math.floor(Math.random() * Math.floor(5)) * 1000 + 1000;
    this.timerHandle = setTimeout(() => {
      this.setState({ isLoading: false });
    }, timeout);
  };

  addressCharacter = (
    character: string,
    idx: number,
    trailingVals: Array<string>,
    addressCharacterIdx: number,
  ) => {
    const itemKey = `${character}-${trailingVals.join('')}-${idx}`;

    const isPaddedChar =
      addressCharPaddingIndices.indexOf(addressCharacterIdx) >= 0;

    return (
      <span
        className={isPaddedChar ? styles.addressSpacer : styles.addressPart}
        key={itemKey}
      >
        {character}
      </span>
    );
  };

  renderFormattedAddress = () => {
    const { searchTerm, wallet } = this.props;
    return (
      <span className={styles.walletAddressContainer}>
        {searchTerm ? (
          <Fragment>
            {wallet.split(searchTerm).reduce((prev, current, idx) => {
              if (!idx) {
                return current
                  .split('')
                  .map((char, localIdx, remainingVals) =>
                    this.addressCharacter(
                      char,
                      localIdx,
                      remainingVals,
                      localIdx,
                    ),
                  );
              }
              let addressCharIdx = prev.length - 1;
              return prev.concat(
                <mark
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${searchTerm}-${idx}`}
                  className={styles.highlight}
                >
                  {searchTerm.split('').map((char, localIdx, remainingVals) => {
                    addressCharIdx += 1;
                    return this.addressCharacter(
                      char,
                      localIdx,
                      remainingVals,
                      addressCharIdx,
                    );
                  })}
                </mark>,
                current.split('').map((char, localIdx, remainingVals) => {
                  addressCharIdx += 1;
                  return this.addressCharacter(
                    char,
                    localIdx,
                    remainingVals,
                    addressCharIdx,
                  );
                }),
              );
            }, [])}
          </Fragment>
        ) : (
          wallet
            .split('')
            .map((char, localIdx, remainingVals) =>
              this.addressCharacter(char, localIdx, remainingVals, localIdx),
            )
        )}
      </span>
    );
  };

  render() {
    const { isLoading } = this.state;
    const { checked, wallet } = this.props;

    const formattedNumberProps = {
      value: 0,
      style: 'currency',
      maximumFractionDigits: 18,
      currency: 'ETH',
      currencyDisplay: 'name',
    };

    return (
      <Fragment>
        <div className={styles.choiceInputContainer}>
          <Radio
            checked={checked}
            name="hardwareWalletChoice"
            value={wallet}
            elementOnly
          >
            {this.renderFormattedAddress()}
          </Radio>
        </div>
        <div className={styles.choiceBalanceContainer}>
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'medium', theme: 'primary' }} />
          ) : (
            <FormattedNumber {...formattedNumberProps} />
          )}
        </div>
      </Fragment>
    );
  }
}

export default HardwareChoice;
