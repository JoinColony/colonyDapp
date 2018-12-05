/* @flow */

import React, { Component } from 'react';
import QRCodeGenerator from 'qrcode';

type Props = {
  address: string,
  width?: number,
};

class QRCode extends Component<Props> {
  static displayName = 'QRCode';

  componentDidMount() {
    const { address, width } = this.props;
    const canvas = document.getElementById('qr-code');

    if (canvas) {
      QRCodeGenerator.toCanvas(canvas, address, { margin: 0, width }, err => {
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
