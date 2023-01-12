import { FormikTouched, setNestedObjectValues, useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FIX_TRIGGER_EVENT_NAME } from '~pages/ExpenditurePage/constants';
import { ValuesType } from '~pages/VerificationPage/types';

import styles from './ErrorsCounter.css';

export const MSG = defineMessages({
  singleErrorMessage: {
    id: 'dashboard.VerificationPage.ErrorsCounter.singleErrorMessage',
    defaultMessage: '{number} required field has an error.',
  },
  mulitpleErrorMessage: {
    id: 'dashboard.VerificationPage.ErrorsCounter.mulitpleErrorMessage',
    defaultMessage: '{number} required fields have an error.',
  },
  errorMessageAction: {
    id: 'dashboard.VerificationPage.ErrorsCounter.errorMessageAction',
    defaultMessage: 'Fix it!',
  },
});

const displayName = 'dashboard.VerificationPage.ErrorsCounter';

const ErrorsCounter = () => {
  const { errors, setTouched } = useFormikContext<ValuesType>();

  const errorCounter = useMemo(() => {
    return isEmpty(errors) ? undefined : Object.keys(errors)?.length;
  }, [errors]);

  const handleFixButtonClick = useCallback(() => {
    setTouched(setNestedObjectValues<FormikTouched<ValuesType>>(errors, true));
    if (!errorCounter) return;

    // get elemenent by name or by data-name
    const firstError =
      document.getElementsByName(Object.keys(errors)[0])?.[0] ||
      document.querySelectorAll(`[data-name=${Object.keys(errors)[0]}]`)?.[0];

    const fieldTypes = ['input', 'textarea'];
    const tagName = firstError?.tagName.toLowerCase();

    if (fieldTypes.includes(tagName)) {
      (firstError as HTMLElement).focus();
    } else if (tagName === 'div') {
      firstError.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      firstError.scrollIntoView({
        behavior: 'smooth',
      });
      const customEvent = new CustomEvent(FIX_TRIGGER_EVENT_NAME, {
        detail: {
          name: Object.keys(errors)[0],
        },
      });

      window.dispatchEvent(customEvent);
    }
  }, [setTouched, errors, errorCounter]);

  return (
    <>
      {errorCounter && (
        <div className={styles.formStagesMsg}>
          <p className={styles.formStagesMsgText}>
            <FormattedMessage
              {...(errorCounter || 0 > 1
                ? { ...MSG.mulitpleErrorMessage }
                : { ...MSG.singleErrorMessage })}
              values={{ number: errorCounter }}
            />
          </p>
          <button
            type="button"
            onClick={handleFixButtonClick}
            className={styles.formStagesMsgAction}
          >
            <FormattedMessage {...MSG.errorMessageAction} />
          </button>
        </div>
      )}
    </>
  );
};

ErrorsCounter.displayName = displayName;

export default ErrorsCounter;
