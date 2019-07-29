/* @flow */
import type { IntlShape } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { toWei } from 'ethjs-unit';
import BN from 'bn.js';

import { getEthToUsd } from '~utils/external';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

const MSG = defineMessages({
  usdAbbreviation: {
    id: 'EthUsd.usdAbbreviation',
    defaultMessage: 'USD',
  },
});

type Appearance = {
  theme: 'primary' | 'grey' | 'dark',
  size: 'medium' | 'large' | 'small',
};

type Props = {
  /** Appearance object for numeral */
  appearance?: Appearance,
  /** Should the prefix be visible? */
  showPrefix: boolean,
  /** Should the suffix be visible? */
  showSuffix: boolean,
  /** Number of decimals to show */
  truncate: number,
  /** Ether unit the number is notated in (e.g. 'ether' = 10^18 wei) */
  unit?: string,
  /** Value in ether to convert to USD */
  value: number | string | BN,
  /** @ignore injected by `injectIntl` */
  intl: IntlShape,
};

type State = {
  valueUsd: number | null,
  requested: boolean,
};

class EthUsd extends Component<Props, State> {
  static displayName = 'EthUsd';

  static defaultProps = {
    showPrefix: true,
    showSuffix: true,
    truncate: 2,
    unit: 'ether',
  };

  state = {
    valueUsd: null,
    requested: false,
  };

  componentDidMount() {
    this.convertEthToUsd();
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.convertEthToUsd();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;

  convertEthToUsd = () => {
    const { unit, value } = this.props;
    let valueToConvert;
    if (BN.isBN(value)) {
      valueToConvert = value;
    } else {
      const fixedNum = typeof value === 'number' ? value.toFixed(18) : value;
      valueToConvert = toWei(fixedNum, unit);
    }
    this.mounted = true;
    getEthToUsd(valueToConvert)
      .then(valueUsd => {
        this.setState({ requested: true });
        if (this.mounted) {
          this.setState({
            valueUsd,
          });
        }
      })
      .catch(() => {
        this.setState({ requested: true });
      });
  };

  render() {
    const { valueUsd, requested } = this.state;
    const {
      appearance,
      intl: { formatMessage },
      showPrefix,
      showSuffix,
      truncate,
      unit,
      value,
      ...rest
    } = this.props;
    const suffixText = formatMessage(MSG.usdAbbreviation);
    return requested ? (
      <Numeral
        appearance={appearance}
        prefix={showPrefix && valueUsd ? '~ ' : ''}
        suffix={showSuffix ? ` ${suffixText}` : ''}
        truncate={truncate}
        value={valueUsd || '-'}
        {...rest}
      />
    ) : (
      <SpinnerLoader />
    );
  }
}

export default injectIntl(EthUsd);
