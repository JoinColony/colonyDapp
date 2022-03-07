import React, { ReactNode } from 'react';
import Textarea, { TextareaAutosizeProps } from 'react-textarea-autosize';
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

interface Props extends Omit<TextareaAutosizeProps, 'placeholder'> {
  /** Appearance object */
  appearance?: Appearance;

  /** Should the element render with its label or not */
  elementOnly?: boolean;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation  */
  helpValues?: SimpleMessageValues;

  /** Pass a ref to the `<textarea>` element */
  innerRef?: (ref: HTMLElement | null) => void;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation  */
  labelValues?: SimpleMessageValues;

  /** Html input `name` attribute */
  name: string;

  /** Placeholder text */
  placeholder?: string | MessageDescriptor;

  /** Status text */
  status?: string | MessageDescriptor;

  /** Status text values */
  statusValues?: SimpleMessageValues;

  /** Provides value for data-test used on cypress testing */
  dataTest?: string;
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
  dataTest,
  ...rest
}: Props) => {
  const { formatMessage } = useIntl();
  const [inputFieldProps, { error }] = useField(name);

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp)
      : placeholderProp;

  const inputProps: TextareaAutosizeProps & {
    ref: ((ref: HTMLElement | null) => void) | undefined;
    'data-test': string | undefined;
  } = {
    'aria-invalid': error ? 'true' : undefined,
    className: getMainClasses(appearance, styles),
    id,
    maxRows,
    minRows,
    placeholder,
    ref: innerRef,
    'data-test': dataTest,
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
