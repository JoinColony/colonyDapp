import React from 'react';
import classNames from 'classnames';

import { useField } from 'formik';
import Select, { Props as SelectProps } from './Select';
import styles from './SelectHorizontal.css';
import InputStatus from '../InputStatus';
import InputLabel from '../InputLabel';

interface Props extends SelectProps {
  unselectable?: boolean;
  optionSizeLarge?: boolean;
  withDropdownElement?: boolean;
  scrollContainer?: HTMLElement | null;
  placement?: 'bottom' | 'right';
  hasBlueActiveState?: boolean;
}

const SelectHorizontal = ({
  unselectable,
  optionSizeLarge,
  withDropdownElement,
  scrollContainer,
  placement,
  ...selectProps
}: Props) => {
  const {
    status,
    statusValues,
    elementOnly,
    name,
    id,
    label,
    labelValues,
    help,
    helpValues,
    hasBlueActiveState,
  } = selectProps;
  const [, { error }] = useField(name);

  return (
    <>
      <div
        className={classNames(styles.horizontalWrapper, {
          [styles.unselectable]: unselectable,
          [styles.optionSizeLarge]: optionSizeLarge,
        })}
      >
        <InputLabel
          inputId={id}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          screenReaderOnly={elementOnly}
        />
        <Select
          {...{
            id,
            withDropdownElement,
            scrollContainer,
            placement,
            hasBlueActiveState,
            ...selectProps,
          }}
          elementOnly
          optionSizeLarge
        />
      </div>
      {!elementOnly && (error || status) && (
        <div className={styles.status}>
          <InputStatus
            appearance={{ theme: 'minimal' }}
            status={status}
            statusValues={statusValues}
            error={error}
          />
        </div>
      )}
    </>
  );
};

export default SelectHorizontal;
