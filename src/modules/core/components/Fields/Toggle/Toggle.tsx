import React from 'react';
import { useField } from 'formik';
import { PopperProps } from 'react-popper';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import InputLabel from '~core/Fields/InputLabel';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { SimpleMessageValues } from '~types/index';

import { getMainClasses } from '~utils/css';

import styles from './Toggle.css';

const displayName = 'Toggle';

interface Appearance {
  theme?: 'primary' | 'danger';
}
interface Props {
  appearance?: Appearance;
  name: string;
  label?: string | MessageDescriptor;
  labelValues?: SimpleMessageValues;
  disabled?: boolean;
  tooltipText?: string | MessageDescriptor;
  tooltipTextValues?: SimpleMessageValues;
  elementOnly?: boolean;
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  tooltipPopperProps?: Omit<PopperProps, 'children'>;
}

const Toggle = ({
  appearance,
  name,
  label,
  labelValues,
  disabled = false,
  elementOnly = false,
  tooltipTextValues,
  tooltipText,
  tooltipPopperProps = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-3, 10],
        },
      },
    ],
  },
}: Props) => {
  const [{ onChange, value }] = useField(name);

  const mainClasses = getMainClasses(appearance, styles);

  return (
    <div className={styles.container}>
      {!elementOnly && label && (
        <InputLabel
          label={label}
          labelValues={labelValues}
          appearance={{ colorSchema: 'grey' }}
        />
      )}
      <div>
        <input
          name={name}
          type="checkbox"
          disabled={disabled}
          checked={value}
          aria-checked={value}
          aria-disabled={disabled}
          className={styles.delegate}
          onChange={onChange}
        />
        <span className={disabled ? styles.toggleDisabled : styles.toggle}>
          <span className={value ? mainClasses : styles.toggleSwitch} />
        </span>
      </div>
      {tooltipText && (
        <Tooltip
          appearance={{ theme: 'dark' }}
          content={
            tooltipText && tooltipText === 'string' ? (
              tooltipText
            ) : (
              <FormattedMessage {...tooltipText} values={tooltipTextValues} />
            )
          }
          trigger="hover"
          popperProps={tooltipPopperProps}
        >
          <div className={styles.icon}>
            <Icon
              name="question-mark"
              appearance={{ size: 'small' }}
              title=""
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

Toggle.displayName = displayName;

export default Toggle;
