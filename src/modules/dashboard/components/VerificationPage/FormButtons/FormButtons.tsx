import { FormikTouched, setNestedObjectValues, useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ReactNode, useCallback } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import Button from '~core/Button';
import { ValuesType } from '~pages/VerificationPage/types';

import styles from './FormButtons.css';

const MSG = defineMessages({
  continue: {
    id: 'dashboard.VerificationPage.FormButtons.continue',
    defaultMessage: 'Continue',
  },
  back: {
    id: 'dashboard.VerificationPage.FormButtons.back',
    defaultMessage: 'Back',
  },
});

const displayName = 'dashboard.VerificationPage.FormButtons';

export interface Props {
  onNextClick?: VoidFunction;
  nextText?: MessageDescriptor;
  onPrevClick?: VoidFunction;
  prevText?: MessageDescriptor;
  errorMessage?: ReactNode;
}

const FormButtons = ({
  onNextClick,
  nextText,
  onPrevClick,
  prevText,
  errorMessage,
}: Props) => {
  const {
    values,
    handleSubmit,
    validateForm,
    setTouched,
    errors: formikErrors,
  } = useFormikContext<ValuesType>() || {};

  const handleNextClick = useCallback(async () => {
    const errors = await validateForm(values);
    const errorsLength = Object.keys(errors)?.length;
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));
    if (errorsLength) return;
    handleSubmit(values as any);
    onNextClick?.();
  }, [handleSubmit, onNextClick, setTouched, validateForm, values]);

  return (
    <div className={styles.wrapper}>
      {errorMessage}
      <div className={styles.buttonsWrapper}>
        {onPrevClick && (
          <Button
            onClick={onPrevClick}
            text={prevText || MSG.back}
            className={styles.backButton}
          />
        )}
        <Button
          onClick={handleNextClick}
          text={nextText || MSG.continue}
          className={styles.nextButton}
          disabled={!isEmpty(formikErrors)}
        />
      </div>
    </div>
  );
};

FormButtons.displayName = displayName;

export default FormButtons;
