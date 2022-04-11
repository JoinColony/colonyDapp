import React, { ReactNode, RefObject, useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useField } from 'formik';
import cx from 'classnames';
import { nanoid } from 'nanoid';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './Textarea.css';

import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';

export interface Appearance {
  theme?: 'fat';
  align?: 'right';
  layout?: 'inline';
  resizable?: 'both' | 'horizontal' | 'vertical';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'transparent' | 'grey';
  size?: 'small';
}

export interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** Should textarea be displayed alone, or with label & status? */
  elementOnly?: boolean;
  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  /** Help text */
  help?: string | MessageDescriptor;
  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;
  /** Textarea html `id` attribute */
  id?: string;
  /** Pass a ref to the `<textarea>` element */
  innerRef?: RefObject<HTMLTextAreaElement>;
  /** Input label text */
  label: string | MessageDescriptor;
  /** Input label values for intl interpolation */
  labelValues?: SimpleMessageValues;
  /** Maximum length (will show counter) */
  maxLength?: number;
  /** Textarea field name (form variable) */
  name: string;
  /** Placeholder text */
  placeholder?: string | MessageDescriptor;
  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;
  /** Status text */
  status?: string | MessageDescriptor;
  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;
  /** Disabled status of Textarea */
  disabled?: boolean;
  /** Testing */
  dataTest?: string;
}

const displayName = 'Textarea';

const Textarea = ({
  appearance = {},
  elementOnly = false,
  extra,
  help,
  helpValues,
  id: idProp,
  innerRef,
  label,
  labelValues,
  maxLength = undefined,
  name,
  placeholder: placeholderProp,
  placeholderValues,
  status,
  statusValues,
  disabled,
  dataTest,
}: Props) => {
  const { formatMessage } = useIntl();
  const [id] = useState(idProp || nanoid());
  const [{ value, ...fieldInputProps }, { error }] = useField<string>({
    name,
    value: '',
  });

  const length = value ? value.length : 0;
  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  return (
    <div className={styles.container}>
      <InputLabel
        appearance={appearance}
        extra={extra}
        help={help}
        helpValues={helpValues}
        inputId={id}
        label={label}
        labelValues={labelValues}
        screenReaderOnly={elementOnly}
      />
      <div className={styles.textareaWrapper}>
        <textarea
          {...fieldInputProps}
          aria-invalid={error ? true : undefined}
          className={getMainClasses(appearance, styles)}
          id={id}
          maxLength={maxLength}
          placeholder={placeholder}
          ref={innerRef}
          value={value}
          aria-disabled={disabled}
          disabled={disabled}
          data-test={dataTest}
        />
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
      {!elementOnly && (
        <InputStatus
          appearance={appearance}
          status={status}
          statusValues={statusValues}
          error={error}
        />
      )}
    </div>
  );
};

Textarea.displayName = displayName;

export default Textarea;
