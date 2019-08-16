import { MessageDescriptor, FormattedMessage } from 'react-intl';
import React from 'react';

import styles from './FormStatus.css';

const displayName = 'FormStatus';

interface Props {
  /** Formik custom status object */
  status?: {
    info?: string | MessageDescriptor;
    error?: string | MessageDescriptor;
  };
}

const FormStatus = ({ status: { info, error } = {} }: Props) => {
  if (!info && !error) return null;
  return (
    <div className={styles.main}>
      {info && (
        <span className={styles.info}>
          {typeof info == 'string' ? info : <FormattedMessage {...info} />}
        </span>
      )}
      {error && (
        <span className={styles.error}>
          {typeof error == 'string' ? error : <FormattedMessage {...error} />}
        </span>
      )}
    </div>
  );
};

FormStatus.displayName = displayName;

export default FormStatus;
