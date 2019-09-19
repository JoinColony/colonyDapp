import React, { useRef, useLayoutEffect } from 'react';
import QRCodeGenerator from 'qrcode';

import { log } from '~utils/debug';

import { Address } from '~types/index';

interface Props {
  address: Address;
  width?: number;
}

const displayName = 'QRCode';

const QRCode = ({ address, width }: Props) => {
  const canvas = useRef(null);
  useLayoutEffect(() => {
    if (canvas.current) {
      QRCodeGenerator.toCanvas(
        canvas.current,
        address,
        {
          margin: 0,
          width,
          color: { light: '#0000', background: '#2F2F2F' },
        },
        (error: Error) => {
          /*
           * This is a normal callback to be called upon finishing generating
           * the QR Code's image pattern, not an Error callback (even though it
           * only receives one argument, and that's an Error object instance)
           *
           * See: https://www.npmjs.com/package/qrcode#cb
           */
          if (error) {
            log.error(error);
          }
        },
      );
    }
  }, [address, width]);
  return <canvas ref={canvas} />;
};

QRCode.displayName = displayName;

export default QRCode;
