/* @flow */

import React, { Component } from 'react';
import QRCodeGenerator from 'qrcode';

type Props = {|
  address: string,
  width?: number,
|};

class QRCode extends Component<Props> {
  static displayName = 'QRCode';

  componentDidMount() {
    const { address, width } = this.props;
    const canvas = document.getElementById('qr-code');

    if (canvas) {
      QRCodeGenerator.toCanvas(
        canvas,
        address,
        { margin: 0, width },
        (error: Error) => {
          /*
           * @NOTE This is normal callback to be called upon finishing generating
           * the QR Code's image pattern, not an Error callback (even though it
           * only receives one argument, and that's an Error objet instance)
           *
           * See: https://www.npmjs.com/package/qrcode#cb
           */
          if (error) {
            /* eslint-disable-next-line no-console */
            console.log(error);
          }
        },
      );
    }
  }

  render() {
    return <canvas id="qr-code" />;
  }
}

export default QRCode;
