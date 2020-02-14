import React, { ReactNode, Component } from 'react';
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
  colorSchema?: 'dark' | 'transparent';
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

class Textarea extends Component<Props & FieldEnhancedProps> {
  static displayName = 'Textarea';

  static defaultProps = {
    appearance: {},
  };

  renderTextarea = inputProps => {
    const { innerRef, maxLength, ...props } = inputProps;
    const { $value } = this.props;
    const length = $value ? $value.length : 0;
    return (
      <div className={styles.textareaWrapper}>
        <textarea ref={innerRef} {...props} maxLength={maxLength} />
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
  };

  render() {
    const {
      $id,
      $value,
      $error,
      appearance = {},
      elementOnly,
      help,
      extra,
      label,
      maxLength = null,
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
    } = this.props;

    const inputProps = {
      id: $id,
      name,
      'aria-invalid': $error ? true : null,
      className: getMainClasses(appearance, styles),
      maxLength,
      value: $value,
      ...props,
    };

    if (elementOnly) {
      return this.renderTextarea(inputProps);
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
        {this.renderTextarea(inputProps)}
        <InputStatus appearance={appearance} status={status} error={$error} />
      </div>
    );
  }
}

export default asField<Props>()(Textarea);
