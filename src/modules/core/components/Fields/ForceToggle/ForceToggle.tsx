import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';
import { MessageDescriptor } from 'react-intl';

import { Toggle } from '~core/Fields';

import styles from './ForceToggle.css';

const displayName = 'ForceToggle';

interface Props {
  name?: string;
  label?: string | MessageDescriptor;
  disabled?: boolean;
  tooltipText?: string | MessageDescriptor;
  tooltipClassName?: string;
  tooltipPopperOptions?: PopperOptions;
  onChange?: (value: boolean) => any;
}

const ForceToggle = ({
  name = 'forceAction',
  label = { id: 'label.force' },
  disabled = false,
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
      name={name}
      label={label}
      disabled={disabled}
      tooltipText={tooltipText}
      tooltipClassName={tooltipClassName}
      tooltipPopperOptions={tooltipPopperOptions}
      onChange={onChange}
    />
  );
};

ForceToggle.displayName = displayName;

export default ForceToggle;
