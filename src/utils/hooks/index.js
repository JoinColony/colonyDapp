/* @flow */

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useEffect, useRef } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
