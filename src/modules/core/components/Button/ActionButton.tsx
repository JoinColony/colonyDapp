import React, { HTMLAttributes, ReactNode, useState } from 'react';

import { ActionTransformFnType } from '~utils/actions';
import { log } from '~utils/debug';
import { useAsyncFunction, useMounted } from '~utils/hooks';
import DefaultButton from '~core/Button';

interface Props extends HTMLAttributes<any> {
  appearance?: any;
  button?: ReactNode;
  disabled?: boolean;
  confirmText?: any;
  error: string;
  loading?: boolean;
  onConfirmToggled?: (...args: any[]) => void;
  onSuccess?: (result: any) => void;
  submit: string;
  success: string;
  text?: string;
  transform?: ActionTransformFnType;
  values?: any | (() => any | Promise<any>);
}

const ActionButton = ({
  button,
  error,
  submit,
  success,
  onSuccess,
  // @todo Remove `values` once async transform functions are supported
  values,
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
      const asyncFuncValues =
        typeof values == 'function' ? await values() : values;
      result = await asyncFunction(asyncFuncValues);
      if (isMountedRef.current) setLoading(false);
    } catch (err) {
      log.verbose(err);
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
