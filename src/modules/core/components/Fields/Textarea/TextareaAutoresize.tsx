import React, { ReactNode, TextareaHTMLAttributes } from 'react';
import Textarea from 'react-textarea-autosize';

import { getMainClasses } from '~utils/css';

import styles from './Textarea.css';

import asField from '../asField';
import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';
import { FieldEnhancedProps } from '../types';

type Appearance = {
  theme?: 'fat';
  align?: 'right';
  layout?: 'inline';
  resizable?: 'both' | 'horizontal' | 'vertical';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'transparent';
  size?: 'small';
};

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** The minimum number of rows to show (css height can interfere with this) */
  minRows?: number;

  /** The maximum number of rows to resize to, before the scrollbar shows up */
  maxRows?: number;

  /** Pass a ref to the `<textarea>` element */
  innerRef?: (ref: HTMLElement | null) => void;
}

const displayName = 'TextareaAutoresize';

const TextareaAutoresize = ({
  $id,
  $value,
  $error,
  appearance = {},
  elementOnly,
  help,
  extra,
  label,
  name,
  minRows = 1,
  maxRows = 4,
  status,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  $touched,
  formatIntl,
  isSubmitting,
  setError,
  setValue,
  connect,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...rest
}: Props & FieldEnhancedProps) => {
  const renderAutoresizingTextarea = inputProps => {
    const { innerRef, ...props } = inputProps;
    return (
      <div className={styles.TextareaAutoresizeWrapper}>
        <Textarea ref={innerRef} {...props} />
      </div>
    );
  };

  const inputProps = {
    id: $id,
    name,
    'aria-invalid': $error ? true : null,
    className: getMainClasses(appearance, styles),
    value: $value,
    minRows,
    maxRows,
    ...rest,
  };

  if (elementOnly) {
    return renderAutoresizingTextarea(inputProps);
  }

  return (
    <div className={styles.container}>
      <InputLabel
        appearance={appearance}
        inputId={$id}
        label={label}
        help={help}
        extra={extra}
      />
      {renderAutoresizingTextarea(inputProps)}
      <InputStatus appearance={appearance} status={status} error={$error} />
    </div>
  );
};

TextareaAutoresize.displayName = displayName;

export default asField<
  Props,
  string,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>()(TextareaAutoresize);
