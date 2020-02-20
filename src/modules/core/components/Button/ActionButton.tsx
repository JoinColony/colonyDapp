import React, { useState, ReactType } from 'react';
import { MessageDescriptor } from 'react-intl';

import { ActionTransformFnType } from '~utils/actions';
import { log } from '~utils/debug';
import { useAsyncFunction, useMounted } from '~utils/hooks';
import DefaultButton from '~core/Button';
import { Props as DefaultButtonProps } from './Button';

interface Props extends DefaultButtonProps {
  button?: ReactType;
  confirmText?: any;
  error: string;
  onConfirmToggled?: (...args: any[]) => void;
  onSuccess?: (result: any) => void;
  submit: string;
  success: string;
  text?: MessageDescriptor | string;
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
