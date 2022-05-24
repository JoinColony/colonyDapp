import React from 'react';
import classNames from 'classnames';

import { useField } from 'formik';
import Select, { Props as SelectProps } from './Select';
import styles from './SelectHorizontal.css';
import InputStatus from '../InputStatus';
import InputLabel from '../InputLabel';

interface Props extends SelectProps {
  unselectable?: boolean;
}

const SelectHorizontal = ({ unselectable, ...selectProps }: Props) => {
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
  } = selectProps;
  const [, { error }] = useField(name);

  return (
    <>
      <div
        className={classNames(styles.horizontalWrapper, {
          [styles.unselectable]: unselectable,
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

        <Select {...{ id, ...selectProps }} elementOnly />
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
