import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';
import { MessageDescriptor } from 'react-intl';

import { Toggle } from '~core/Fields';

import { SimpleMessageValues } from '~types/index';

import styles from './ForceToggle.css';

const displayName = 'ForceToggle';

interface Appearance {
  theme?: 'primary' | 'danger';
}

interface Props {
  appearance?: Appearance;
  name?: string;
  label?: string | MessageDescriptor;
  labelValues?: SimpleMessageValues;
  disabled?: boolean;
  elementOnly?: boolean;
  tooltipTextValues?: SimpleMessageValues;
  tooltipText?: string | MessageDescriptor;
  tooltipClassName?: string;
  tooltipPopperOptions?: PopperOptions;
  onChange?: (value: boolean) => any;
}

const ForceToggle = ({
  appearance,
  name = 'forceAction',
  label = { id: 'label.force' },
  labelValues,
  disabled = false,
  elementOnly,
  tooltipTextValues,
  tooltipText = { id: 'tooltip.forceToggle' },
  tooltipClassName = styles.tooltip,
  tooltipPopperOptions = {
    placement: 'top-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [10, 12],
        },
      },
    ],
  },
  onChange,
}: Props) => {
  return (
    <Toggle
      appearance={appearance}
      name={name}
      label={label}
      labelValues={labelValues}
      disabled={disabled}
      elementOnly={elementOnly}
      tooltipTextValues={tooltipTextValues}
      tooltipText={tooltipText}
      tooltipClassName={tooltipClassName}
      tooltipPopperOptions={tooltipPopperOptions}
      onChange={onChange}
    />
  );
};

ForceToggle.displayName = displayName;

export default ForceToggle;
