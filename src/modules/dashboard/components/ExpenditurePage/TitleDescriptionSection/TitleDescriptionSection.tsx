import { useField } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Input } from '~core/Fields';

import styles from './TitleDescriptionSection.css';

const MSG = defineMessages({
  titlePlaceholder: {
    id: 'dashboard.Expenditures.TitleDescriptionSection.titlePlaceholder',
    defaultMessage: 'Enter expenditure title',
  },
  descriptionPlaceholder: {
    id: 'dashboard.Expenditures.TitleDescriptionSection.descriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
});

interface Props {
  isEditable?: boolean;
}

const TitleDescriptionSection = ({ isEditable }: Props) => {
  const [, { value: title }] = useField('title');
  const [, { value: description }] = useField('description');

  return (
    <div className={styles.container}>
      {/* "Exp - 25" is temporary value, needs to be changed to fetched value, id? */}
      <div className={styles.number}>Exp - 25</div>
      <div className={styles.titleContainer}>
        {isEditable ? (
          <Input
            name="title"
            placeholder={MSG.titlePlaceholder}
            appearance={{ theme: 'minimal' }}
            defaultValue={title}
          />
        ) : (
          <div className={styles.title}>{title}</div>
        )}
      </div>
      <div className={styles.descriptionContainer}>
        {isEditable ? (
          <Input
            name="description"
            placeholder={MSG.descriptionPlaceholder}
            appearance={{ theme: 'minimal' }}
            defaultValue={title}
          />
        ) : (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </div>
  );
};

export default TitleDescriptionSection;
