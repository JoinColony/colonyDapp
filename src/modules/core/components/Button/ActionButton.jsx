/* @flow */

import type { ComponentType } from 'react';

// $FlowFixMe
import React, { useState } from 'react';

import { log } from '~utils/debug';
import { useAsyncFunction } from '~utils/hooks';
import DefaultButton from '~core/Button';

// TODO if this object is sealed, there are unspecified props being used
type Props = {
  button?: ComponentType<*>,
  error: string,
  submit: string,
  success: string,
  values?: Object | (() => Object | Promise<Object>),
  willUnmountOnSuccess?: boolean,
};

const ActionButton = ({
  button,
  error: reject,
  submit: start,
  success: resolve,
  values,
  willUnmountOnSuccess,
  ...props
}: Props) => {
  const [loading, setLoading] = useState(false);
  const asyncFunc = useAsyncFunction({ start, reject, resolve });

  const handleClick = async () => {
    setLoading(true);
    try {
      const asyncFuncValues =
        typeof values == 'function' ? await values() : values;
      await asyncFunc.current.asyncFunction(asyncFuncValues);
      if (!willUnmountOnSuccess) setLoading(false);
    } catch (error) {
      log(error);
      setLoading(false);
      // TODO: display error somewhere
    }
  };

  const Button = button || DefaultButton;
  return <Button onClick={handleClick} loading={loading} {...props} />;
};

export default ActionButton;
