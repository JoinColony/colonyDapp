/* @flow */

import type { ComponentType } from 'react';

// $FlowFixMe
import React, { useState } from 'react';

import type { ActionTransformFnType } from '~utils/actions';

import { log } from '~utils/debug';
import { useAsyncFunction, useMounted } from '~utils/hooks';
import DefaultButton from '~core/Button';

type Props = {
  button?: ComponentType<*>,
  error: string,
  submit: string,
  success: string,
  onSuccess?: (result: any) => void,
  transform?: ActionTransformFnType,
};

const ActionButton = ({
  button,
  error,
  submit,
  success,
  onSuccess,
  transform,
  ...props
}: Props) => {
  const isMountedRef = useMounted();
  const [loading, setLoading] = useState(false);
  const asyncFunction = useAsyncFunction({ submit, error, success, transform });

  const handleClick = async () => {
    let result;
    setLoading(true);
    try {
      result = await asyncFunction();
      if (isMountedRef.current) setLoading(false);
    } catch (err) {
      log(err);
      setLoading(false);

      /**
       * @todo : display error somewhere
       */
      return;
    }
    if (typeof onSuccess == 'function') onSuccess(result);
  };

  const Button = button || DefaultButton;
  return <Button onClick={handleClick} loading={loading} {...props} />;
};

export default ActionButton;
