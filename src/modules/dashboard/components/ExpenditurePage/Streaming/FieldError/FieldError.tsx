import { useField } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './FieldError.css';

interface Props {
  name: string;
}

const FieldError = ({ name }: Props) => {
  const { formatMessage } = useIntl();
  const [, { error }] = useField(name);
  const errorText = typeof error === 'object' ? formatMessage(error) : error;

  return (
    <div className={classNames(styles.wrapper, { [styles.hidden]: !error })}>
      {errorText}
    </div>
  );
};

export default FieldError;
