import React, { ReactNode } from 'react';
import nanoid from 'nanoid';
import { compose, lifecycle } from 'recompose';
import { MessageDescriptor, MessageValues } from 'react-intl';

import { getMainClasses } from '~utils/css';
import InputLabel from '../InputLabel';
import asField from '../asField';
import styles from './Radio.css';

export interface Appearance {
  direction?: 'horizontal' | 'vertical';
  theme?: 'buttonGroup' | 'fakeCheckbox' | 'colorPicker';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** If the input is checked */
  checked: boolean;
  /** Children to render in place of the default label */
  children?: ReactNode;
  /** Disable the input */
  disabled?: boolean;
  /** Display the element without label */
  elementOnly?: boolean;
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues;
  /** Label text */
  label?: string | MessageDescriptor;
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues;
  /** Input field name (form variable) */
  name: string;
  /** Style object for the visible radio */
  radioStyle?: { [k: string]: string };
  /** @ignore Will be injected by `lifecycle` from `enhance` */
  inputId?: string;
  /** @ignore Will be injected by `asField` */
  $id?: string;
  /** @ignore Will be injected by `asField` */
  $error?: string;
  /** @ignore Will be injected by `asField` */
  $value?: string;
  /** @ignore Will be injected by `asField` */
  $touched?: boolean;
  /** @ignore Will be injected by `asField` */
  isSubmitting?: boolean;
  /** @ignore Will be injected by `asField` */
  formatIntl?: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string;
  /** @ignore Will be injected by `asField` */
  setValue?: (val: any) => void;
  /** @ignore Will be injected by `asField` */
  setError?: (val: any) => void;
  /** @ignore Standard input field property */
  onChange?: any;
  value?: any;
}

const displayName = 'Radio';

const Radio = ({
  appearance,
  checked,
  children,
  disabled,
  elementOnly,
  $error,
  help,
  inputId,
  label,
  name,
  $value,
  radioStyle,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  helpValues,
  $id,
  labelValues,
  formatIntl,
  $touched,
  setError,
  setValue,
  isSubmitting,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props) => (
  <label
    className={getMainClasses(appearance, styles, {
      customChildren: !!children,
      isChecked: checked,
      isDisabled: !!disabled,
    })}
    htmlFor={elementOnly ? inputId : null}
  >
    <>
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
        {!!appearance && appearance.theme === 'fakeCheckbox' && (
          <span className={styles.checkmark} />
        )}
      </span>
      {!elementOnly && !!label ? (
        <span className={styles.labelContainer}>
          <InputLabel
            appearance={{ direction: 'horizontal' }}
            label={label}
            help={help}
            inputId={inputId}
          />
        </span>
      ) : (
        label || children
      )}
    </>
  </label>
);

Radio.displayName = displayName;

Radio.defaultProps = {
  appearance: {
    direction: 'vertical',
  },
  disabled: false,
  elementOnly: false,
};

const enhance = compose(
  asField() as any,
  lifecycle({
    componentDidMount() {
      const inputId = nanoid();
      this.setState({ inputId });
    },
  }),
);

export default enhance(Radio) as any;
