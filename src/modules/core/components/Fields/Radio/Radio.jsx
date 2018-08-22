/* @flow */
import React, { Fragment } from 'react';
import nanoid from 'nanoid';
import { compose, lifecycle } from 'recompose';

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import { getMainClasses } from '~utils/css';

import InputLabel from '../InputLabel';
import asField from '../asField';

import styles from './Radio.css';

type Appearance = {
  direction?: 'horizontal' | 'vertical',
  theme?: 'fakeCheckbox' | 'colorPicker',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** If the input is checked */
  checked: boolean,
  /** Children to render in place of the default label */
  children?: Node,
  /** Disable the input */
  disabled?: boolean,
  /** Display the element without label */
  elementOnly?: boolean,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** Input field name (form variable) */
  name: string,
  /** Style object for the visible radio */
  radioStyle?: { [string]: string },
  /** @ignore Will be injected by `lifecycle` from `enhance` */
  inputId: string,
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  isSubmitting?: boolean,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
  /** @ignore Standard input field property */
  onChange: Function,
};

const displayName = 'Radio';

const Radio = ({
  appearance,
  checked,
  children,
  disabled,
  elementOnly,
  $error,
  help,
  helpValues,
  $id,
  inputId,
  label,
  labelValues,
  formatIntl,
  name,
  $value,
  $touched,
  radioStyle,
  setError,
  setValue,
  isSubmitting,
  ...props
}: Props) => {
  const stateClass = checked ? styles.isChecked : styles.isUnchecked;
  return (
    <label
      className={`${getMainClasses(appearance, styles)} ${stateClass}`}
      htmlFor={elementOnly ? inputId : null}
    >
      <Fragment>
        <input
          className={styles.delegate}
          value={$value}
          name={name}
          type="radio"
          id={inputId}
          disabled={disabled}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-invalid={!!$error}
          {...props}
        />
        <span className={styles.radio} style={radioStyle}>
          {!!appearance &&
            appearance.theme === 'fakeCheckbox' && (
              <span className={styles.checkmark} />
            )}
        </span>
        {!elementOnly && !!label ? (
          <InputLabel
            appearance={{ direction: 'horizontal' }}
            label={label}
            error={$error}
            help={help}
            inputId={inputId}
          />
        ) : (
          label || children
        )}
      </Fragment>
    </label>
  );
};

Radio.displayName = displayName;

Radio.defaultProps = {
  appearance: {
    direction: 'vertical',
  },
  disabled: false,
  elementOnly: false,
};

const enhance = compose(
  asField(),
  lifecycle({
    componentDidMount() {
      const inputId = nanoid();
      this.setState({ inputId });
    },
  }),
);

export default enhance(Radio);
