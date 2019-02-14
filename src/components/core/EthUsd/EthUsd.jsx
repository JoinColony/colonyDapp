/* @flow */
import type { IntlShape } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { toWei } from 'ethjs-unit';
import BN from 'bn.js';

import { getEthToUsd } from '~utils/external';
import Numeral from '~components/core/Numeral';
import { SpinnerLoader } from '~components/core/Preloaders';

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

type Props = {|
  /** Appearance object for numeral */
  appearance?: Appearance,
  /** Number of decimals to show */
  decimals: number,
  /** Should the prefix be visible? */
  showPrefix: boolean,
  /** Should the suffix be visible? */
  showSuffix: boolean,
  /** Ether unit the number is notated in (e.g. 'ether' = 10^18 wei) */
  unit?: string,
  /** Value in ether to convert to USD */
  value: number | string | BN,
  /** @ignore injected by `injectIntl` */
  intl: IntlShape,
|};

type State = {
  valueUsd: number | null,
};

class EthUsd extends Component<Props, State> {
  static displayName = 'EthUsd';

  static defaultProps = {
    decimals: 2,
    showPrefix: true,
    showSuffix: true,
    unit: 'ether',
  };

  state = {
    valueUsd: null,
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
    getEthToUsd(valueToConvert).then(valueUsd => {
      if (this.mounted) {
        this.setState({
          valueUsd,
        });
      }
    });
  };

  render() {
    const { valueUsd } = this.state;
    const {
      appearance,
      decimals,
      intl: { formatMessage },
      showPrefix,
      showSuffix,
      unit,
      value,
      ...rest
    } = this.props;
    const suffixText = formatMessage(MSG.usdAbbreviation);
    return valueUsd || valueUsd === 0 ? (
      <Numeral
        appearance={appearance}
        decimals={decimals}
        prefix={showPrefix ? '~ ' : ''}
        suffix={showSuffix ? ` ${suffixText}` : ''}
        value={valueUsd}
        {...rest}
      />
    ) : (
      <SpinnerLoader />
    );
  }
}

export default injectIntl(EthUsd);
