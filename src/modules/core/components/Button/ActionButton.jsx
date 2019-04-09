/* @flow */

import type { ComponentType } from 'react';

// $FlowFixMe
import React, { useState } from 'react';

import { log } from '~utils/debug';
import { useAsyncFunction, useMounted } from '~utils/hooks';
import DefaultButton from '~core/Button';

// TODO if this object is sealed, there are unspecified props being used
type Props = {
  button?: ComponentType<*>,
  error: string,
  submit: string,
  success: string,
  values?: Object | (() => Object | Promise<Object>),
};

const ActionButton = ({
  button,
  error,
  submit,
  success,
  values,
  ...props
}: Props) => {
  const isMountedRef = useMounted();
  const [loading, setLoading] = useState(false);
  const asyncFunc = useAsyncFunction({ submit, error, success });

  const handleClick = async () => {
    setLoading(true);
    try {
      const asyncFuncValues =
        typeof values == 'function' ? await values() : values;
      await asyncFunc.current.asyncFunction(asyncFuncValues);
      if (isMountedRef.current) setLoading(false);
    } catch (err) {
      log(err);
      setLoading(false);
      // TODO: display error somewhere
    }
  };

  const Button = button || DefaultButton;
  return <Button onClick={handleClick} loading={loading} {...props} />;
};

export default ActionButton;
