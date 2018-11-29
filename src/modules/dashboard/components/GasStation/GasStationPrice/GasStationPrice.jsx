/* @flow */
import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getMainClasses } from '~utils/css';
import { getEthToUsd } from '~utils/external';
import Alert from '~core/Alert';
import Button from '~core/Button';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './GasStationPrice.css';

const MSG = defineMessages({
  networkCongestedWarning: {
    id: 'dashboard.GasStationPrice.networkCongestedWarning',
    defaultMessage: `The network is congested and transactions
are expensive. We recommend waiting.`,
  },
  openTransactionSpeedMenuTitle: {
    id: 'dashboard.GasStationPrice.openTransactionSpeedMenuTitle',
    defaultMessage: 'Change Transaction Speed',
  },
  transactionFeeLabel: {
    id: 'dashboard.GasStationPrice.transactionFeeLabel',
    defaultMessage: 'Transaction fee',
  },
  transactionSpeedLabel: {
    id: 'dashboard.GasStationPrice.transactionSpeedLabel',
    defaultMessage: 'Transaction speed',
  },
  walletPromptText: {
    id: 'dashboard.GasStationPrice.walletPromptText',
    defaultMessage: `Finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}  
    }.`,
  },
});

type Props = {
  transactionFee: number,
};

type State = {
  ethUsd: number | null,
  isSpeedMenuOpen: boolean,
};

class GasStationPrice extends Component<Props, State> {
  static displayName = 'GasStationPrice';

  state = {
    ethUsd: null,
    isSpeedMenuOpen: false,
  };

  componentDidMount() {
    this.mounted = true;
    const { transactionFee } = this.props;
    getEthToUsd(transactionFee).then(converted => {
      if (this.mounted) {
        this.setState({
          ethUsd: converted,
        });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;

  toggleSpeedMenu = () => {
    const { isSpeedMenuOpen } = this.state;
    this.setState({
      isSpeedMenuOpen: !isSpeedMenuOpen,
    });
  };

  render() {
    const { transactionFee } = this.props;
    const { ethUsd, isSpeedMenuOpen } = this.state;

    return (
      <div className={getMainClasses({}, styles, { isSpeedMenuOpen })}>
        {isSpeedMenuOpen && (
          <div className={styles.transactionSpeedContainer}>
            <FormattedMessage {...MSG.transactionSpeedLabel} />
            {/* Transaction speed button group goes here */}
          </div>
        )}
        <div className={styles.transactionFeeContainer}>
          <div className={styles.transactionFeeMenu}>
            <div className={styles.transactionSpeedMenuButtonContainer}>
              <button
                className={styles.transactionSpeedMenuButton}
                onClick={this.toggleSpeedMenu}
                type="button"
              >
                <Icon
                  appearance={{ size: 'medium' }}
                  name="caret-down-small"
                  title={MSG.openTransactionSpeedMenuTitle}
                />
              </button>
            </div>
            <div className={styles.transactionFeeInfo}>
              <div className={styles.transactionFeeLabel}>
                <FormattedMessage {...MSG.transactionFeeLabel} />
              </div>
              <div className={styles.transactionDuration}>2h 24min</div>
            </div>
          </div>
          <div className={styles.transactionFeeActions}>
            <div className={styles.transactionFeeAmount}>
              <Numeral value={transactionFee} suffix=" ETH" />
              <div className={styles.transactionFeeEthUsd}>
                {ethUsd ? (
                  <Numeral
                    appearance={{ size: 'small', theme: 'grey' }}
                    prefix="~ "
                    value={ethUsd}
                    suffix=" USD"
                  />
                ) : (
                  <SpinnerLoader />
                )}
              </div>
            </div>
            <div>
              <Button text={{ id: 'button.confirm' }} />
            </div>
          </div>
        </div>
        <div className={styles.walletPromptContainer}>
          <Alert
            text={MSG.walletPromptText}
            textValues={{
              walletType: 'metamask',
            }}
          />
        </div>
      </div>
    );
  }
}

export default GasStationPrice;
