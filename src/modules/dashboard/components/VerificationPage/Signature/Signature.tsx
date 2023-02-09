import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Input, InputLabel, InputStatus } from '~core/Fields';
import { Step } from '~pages/VerificationPage/types';
import { useVerificationContext } from '~pages/VerificationPage/VerificationDataContext';

import ErrorsCounter from '../ErrorsCounter';
import FormButtons from '../FormButtons';

import { validationSchema } from './constants';
import styles from './Signature.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.VerificationPage.Signature.title',
    defaultMessage: 'Sign and send',
  },
  description: {
    id: 'dashboard.VerificationPage.Signature.description',
    defaultMessage: `One last thing. You need to sign the document. `,
  },
  label: {
    id: 'dashboard.VerificationPage.Signature.label',
    defaultMessage: 'Type in your name and surname',
  },
  additionalText: {
    id: 'dashboard.VerificationPage.Signature.additionalText',
    defaultMessage: 'E.g. John Wood',
  },
  buttonText: {
    id: 'dashboard.VerificationPage.Signature.buttonText',
    defaultMessage: 'Submit',
  },
  clear: {
    id: 'dashboard.VerificationPage.Signature.clear',
    defaultMessage: 'Clear',
  },
});

const displayName = 'dashboard.VerificationPage.Signature';

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<Step>>;
}

const Signature = ({ setActiveStep }: Props) => {
  const {
    formValues: { signature },
    setFormValues,
  } = useVerificationContext();

  const handleSubmit = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        signature: values,
      }));
    },
    [setFormValues],
  );

  const handlePrevClick = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        signature: values,
      }));
      setActiveStep(Step.References);
    },
    [setActiveStep, setFormValues],
  );

  const [shouldValidate, setShouldValidate] = useState(false);
  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  return (
    <Formik
      initialValues={signature}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      {({ values, errors, setValues }) => (
        <div className={styles.wrapper}>
          <div className={styles.formWrapper}>
            <div className={styles.header}>
              <FormattedMessage {...MSG.title} />
            </div>
            <div className={styles.description}>
              <FormattedMessage {...MSG.description} />
            </div>
            <div className={styles.inputWrapper}>
              <div className={styles.labelClearWrapper}>
                <InputLabel label={MSG.label} />
                <Button
                  type="reset"
                  text={MSG.clear}
                  onClick={() => setValues({ signature: undefined })}
                  appearance={{ theme: 'blue' }}
                  disabled={!values.signature}
                />
              </div>
              <Input
                name="signature"
                label={MSG.label}
                help={MSG.additionalText}
                elementOnly
              />
              {errors?.signature && !Array.isArray(errors.signature) ? (
                <InputStatus error={errors?.signature} />
              ) : (
                <span className={styles.helpWrapper}>
                  <FormattedMessage {...MSG.additionalText} />
                </span>
              )}
            </div>
            <FormButtons
              onNextClick={() => {}}
              onPrevClick={() => handlePrevClick(values)}
              nextText={MSG.buttonText}
              errorMessage={<ErrorsCounter />}
            />
          </div>
        </div>
      )}
    </Formik>
  );
};

Signature.displayName = displayName;

export default Signature;
