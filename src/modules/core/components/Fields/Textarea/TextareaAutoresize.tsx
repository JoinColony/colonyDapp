import React, { ReactNode, HTMLAttributes } from 'react';
import Textarea from 'react-textarea-autosize';
import { useField } from 'formik';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './Textarea.css';

import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';

type Appearance = {
  theme?: 'fat';
  align?: 'right';
  layout?: 'inline';
  resizable?: 'both' | 'horizontal' | 'vertical';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent';
  size?: 'small';
};

interface Props
  extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'placeholder'> {
  /** Appearance object */
  appearance?: Appearance;

  /** If set, it will allow the element to be focused when mounted */
  autoFocus?: boolean;

  /** Is the input disabled */
  disabled?: boolean;

  /** Should the element render with its label or not */
  elementOnly?: boolean;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation  */
  helpValues?: SimpleMessageValues;

  /** Input id */
  id?: string;

  /** Pass a ref to the `<textarea>` element */
  innerRef?: (ref: HTMLElement | null) => void;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation  */
  labelValues?: SimpleMessageValues;

  /** The maximum number of rows to resize to, before the scrollbar shows up */
  maxRows?: number;

  /** The minimum number of rows to show (css height can interfere with this) */
  minRows?: number;

  /** Html input `name` attribute */
  name: string;

  /** Placeholder text */
  placeholder?: string | MessageDescriptor;

  /** Status text */
  status?: string | MessageDescriptor;

  /** Status text values */
  statusValues?: SimpleMessageValues;
}

const displayName = 'TextareaAutoresize';

const TextareaAutoresize = ({
  id,
  appearance = {},
  elementOnly,
  help,
  helpValues,
  innerRef,
  extra,
  label,
  labelValues,
  name,
  minRows = 1,
  maxRows = 4,
  placeholder: placeholderProp,
  status,
  statusValues,
  ...rest
}: Props) => {
  const { formatMessage } = useIntl();
  const [inputFieldProps, { error }] = useField(name);

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp)
      : placeholderProp;

  const inputProps = {
    'aria-invalid': error ? true : null,
    className: getMainClasses(appearance, styles),
    id,
    maxRows,
    minRows,
    placeholder,
    inputRef: innerRef,
    title:
      typeof label === 'object' ? formatMessage(label, labelValues) : label,
    ...rest,
    ...inputFieldProps,
  };

  const renderAutoresizingTextarea = () => {
    return (
      <div className={styles.TextareaAutoresizeWrapper}>
        <Textarea {...inputProps} />
      </div>
    );
  };

  if (elementOnly) {
    return renderAutoresizingTextarea();
  }

  return (
    <div className={styles.container}>
      <InputLabel
        appearance={appearance}
        inputId={id}
        label={label}
        labelValues={labelValues}
        help={help}
        helpValues={helpValues}
        extra={extra}
        screenReaderOnly={elementOnly}
      />
      <div className={styles.TextareaAutoresizeWrapper}>
        {renderAutoresizingTextarea()}
      </div>
      <InputStatus
        appearance={appearance}
        status={status}
        statusValues={statusValues}
        error={error}
      />
    </div>
  );
};

TextareaAutoresize.displayName = displayName;

export default TextareaAutoresize;
