import { useField } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Input, TextareaAutoresize } from '~core/Fields';

import styles from './TitleDescriptionSection.css';
import { ErrorDot } from '../ErrorDot';

const MSG = defineMessages({
  titlePlaceholder: {
    id: 'dashboard.ExpenditurePage.TitleDescriptionSection.titlePlaceholder',
    defaultMessage: 'Enter expenditure title',
  },
  titleTooltipError: {
    id: 'dashboard.ExpenditurePage.TitleDescriptionSection.titleTooltipError',
    defaultMessage: 'Required field error',
  },
  descriptionPlaceholder: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.ExpenditurePage.TitleDescriptionSection.descriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
});

const displayName = 'dashboard.ExpenditurePage.TitleDescriptionSection';

const TitleDescriptionSection = () => {
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
        <Input
          name="title"
          placeholder={MSG.titlePlaceholder}
          appearance={{ theme: 'minimal' }}
          defaultValue={title}
          elementOnly
        />
        {inputError && (
          <div className={styles.errorDotContainer}>
            <ErrorDot
              tooltipContent={<FormattedMessage {...MSG.titleTooltipError} />}
            />
          </div>
        )}
      </div>
      <div
        className={classNames(
          styles.descriptionContainer,
          descriptionError && styles.error,
        )}
      >
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

TitleDescriptionSection.displayName = displayName;

export default TitleDescriptionSection;
