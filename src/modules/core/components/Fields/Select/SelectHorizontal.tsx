import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';

import {
  DROPDOWN_HEIGHT,
  DROPDOWN_ITEM_HEIGHT,
} from '~core/UserPickerWithSearch/constants';

import InputStatus from '../InputStatus';
import InputLabel from '../InputLabel';

import Select, { Props as SelectProps } from './Select';
import styles from './SelectHorizontal.css';

interface Props extends SelectProps {
  unselectable?: boolean;
  optionSizeLarge?: boolean;
  withDropdownElement?: boolean;
  scrollContainer?: HTMLElement | null;
  placement?: 'bottom' | 'right';
  hasBlueActiveState?: boolean;
  autoHeight?: boolean;
}

const SelectHorizontal = ({
  unselectable,
  optionSizeLarge,
  withDropdownElement,
  scrollContainer,
  placement,
  autoHeight,
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
    options,
  } = selectProps;
  const [, { error }] = useField(name);

  const dropdownHeight = useMemo(() => {
    const height = options.length * DROPDOWN_ITEM_HEIGHT;
    return height > DROPDOWN_HEIGHT ? DROPDOWN_HEIGHT : height;
  }, [options]);

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
            dropdownHeight,
            autoHeight,
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
