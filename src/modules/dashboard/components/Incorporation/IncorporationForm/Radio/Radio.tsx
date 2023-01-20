import React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import { Radio as BaseRadio } from '~core/Fields';
import { Props as RadioProps } from '~core/Fields/Radio/Radio';

import styles from './Radio.css';

const displayName = 'dashboard.Incorporation.IncorporationForm.Radio';

const Radio = ({ name, checked, label, value }: RadioProps) => {
  const { formatMessage } = useIntl();
  const labelText = typeof label === 'object' ? formatMessage(label) : label;

  return (
    <div
      className={classNames(styles.radioWrapper, {
        [styles.selected]: checked,
      })}
    >
      <BaseRadio name={name} value={value} checked={checked} elementOnly>
        {labelText}
      </BaseRadio>
    </div>
  );
};

Radio.displayName = displayName;

export default Radio;
