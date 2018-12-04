/* @flow */

import React, { Component } from 'react';
import QRCodeGenerator from 'qrcode';

type Props = {
  walletAddress: string,
  version?: number,
};

class QRCode extends Component<Props> {
  static displayName = 'QRCode';

  componentDidMount() {
    const { walletAddress, version } = this.props;
    const canvas = document.getElementById('qr-code');

    if (canvas) {
      QRCodeGenerator.toCanvas(canvas, walletAddress, { version }, err => {
        /* eslint-disable-next-line no-console */
        console.log(err);
      });
    }
  }

  render() {
    return <canvas id="qr-code" />;
  }
}

export default QRCode;
