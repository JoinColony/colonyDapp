import { FormikTouched, setNestedObjectValues, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
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
}

const FormButtons = ({
  onNextClick,
  nextText,
  onPrevClick,
  prevText,
}: Props) => {
  const { values, handleSubmit, validateForm, setTouched } =
    useFormikContext<ValuesType>() || {};

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
      />
    </div>
  );
};

FormButtons.displayName = displayName;

export default FormButtons;
