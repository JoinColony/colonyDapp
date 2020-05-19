import React, { ReactNode, useCallback } from 'react';
import cx from 'classnames';

import { getMainClasses } from '~utils/css';

import asField from '../asField';
import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';
import { FieldEnhancedProps } from '../types';

import styles from './Textarea.css';

interface Appearance {
  theme?: 'fat';
  align?: 'right';
  layout?: 'inline';
  resizable?: 'both' | 'horizontal' | 'vertical';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'transparent' | 'grey';
  size?: 'small';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Textarea field name (form variable) */
  name: string;

  /** Pass a ref to the `<textarea>` element */
  innerRef?: (ref: HTMLElement | null) => void;

  /** Maximum length (will show counter) */
  maxLength?: number;
}

const displayName = 'Textarea';

const Textarea = ({
  $id,
  $value,
  $error,
  appearance = {},
  elementOnly,
  help,
  extra,
  label,
  maxLength = undefined,
  name,
  status,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  $touched,
  formatIntl,
  isSubmitting,
  setError,
  setValue,
  connect,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props & FieldEnhancedProps) => {
  const inputProps = {
    id: $id,
    name,
    'aria-invalid': $error ? true : undefined,
    className: getMainClasses(appearance, styles),
    maxLength,
    value: $value,
    ...props,
  };

  const renderTextarea = useCallback(() => {
    const { innerRef, ...restInputProps } = inputProps;
    const length = $value ? $value.length : 0;
    return (
      <div className={styles.textareaWrapper}>
        <textarea ref={innerRef} {...restInputProps} maxLength={maxLength} />
        {maxLength && (
          <span
            className={cx(styles.count, {
              [styles.limit]: length === maxLength,
            })}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>
    );
  }, [inputProps, $value, maxLength]);

  if (elementOnly) {
    return renderTextarea();
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
      {renderTextarea()}
      <InputStatus appearance={appearance} status={status} error={$error} />
    </div>
  );
};

Textarea.displayName = displayName;

export default asField<Props>()(Textarea);
