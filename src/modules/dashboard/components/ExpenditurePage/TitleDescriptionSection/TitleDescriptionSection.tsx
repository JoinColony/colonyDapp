import { useField } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';
import classNames from 'classnames';

import { Input, TextareaAutoresize } from '~core/Fields';

import styles from './TitleDescriptionSection.css';

const MSG = defineMessages({
  titlePlaceholder: {
    id: 'dashboard.ExpenditurePage.TitleDescriptionSection.titlePlaceholder',
    defaultMessage: 'Enter expenditure title',
  },
  descriptionPlaceholder: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.ExpenditurePage.TitleDescriptionSection.descriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
});

interface Props {
  isEditable?: boolean;
}

const TitleDescriptionSection = ({ isEditable }: Props) => {
  const [, { value: title, error: inputError }] = useField('title');
  const [, { value: description, error: descriptionError }] = useField(
    'description',
  );

  return (
    <div className={styles.container}>
      {/* "Exp - 25" is temporary value, needs to be changed to fetched value, id? */}
      <div className={styles.number}>Exp - 25</div>
      <div
        className={classNames(
          styles.titleContainer,
          inputError && styles.error,
        )}
      >
        {isEditable ? (
          <Input
            name="title"
            placeholder={MSG.titlePlaceholder}
            appearance={{ theme: 'minimal' }}
            defaultValue={title}
            elementOnly
          />
        ) : (
          <div className={styles.title}>{title}</div>
        )}
      </div>
      <div
        className={classNames(
          styles.descriptionContainer,
          descriptionError && styles.error,
        )}
      >
        {isEditable ? (
          <TextareaAutoresize
            name="description"
            placeholder={MSG.descriptionPlaceholder}
            label=""
            minRows={1}
            maxRows={100}
            elementOnly
          />
        ) : (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </div>
  );
};

export default TitleDescriptionSection;
