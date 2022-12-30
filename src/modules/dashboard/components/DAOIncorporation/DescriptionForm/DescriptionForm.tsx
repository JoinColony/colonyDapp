import { useField } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TextareaAutoresize } from '~core/Fields';

import styles from './DescriptionForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.DAOIncorporation.DescriptionForm.title',
    defaultMessage: 'Incorporate this DAO',
  },
  descriptionPlaceholder: {
    id: `dashboard.DAOIncorporation.DescriptionForm.descriptionPlaceholder`,
    defaultMessage: 'Add description of why you are incorporating...',
  },
});

const displayName = 'dashboard.DAOIncorporation.DescriptionForm';

const DescriptionForm = () => {
  const [, { value: description }] = useField('description');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </h1>
      <div className={styles.descriptionContainer}>
        <TextareaAutoresize
          name="description"
          placeholder={MSG.descriptionPlaceholder}
          label=""
          minRows={1}
          maxRows={100}
          value={description}
          elementOnly
        />
      </div>
    </div>
  );
};

DescriptionForm.displayName = displayName;

export default DescriptionForm;
