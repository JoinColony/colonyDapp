import React, { useCallback, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { Formik } from 'formik';
import classNames from 'classnames';

import { Input, InputStatus, Select, Textarea } from '~core/Fields';
import FileUpload from '~core/FileUpload';
import { useVerificationContext } from '~pages/VerificationPage/VerificationDataContext';
import { Step } from '~pages/VerificationPage/types';

import FormButtons from '../FormButtons/FormButtons';
import ErrorsCounter from '../ErrorsCounter';

import { validationSchema } from './constants';
import styles from './Location.css';

export const MSG = defineMessages({
  step: {
    id: 'dashboard.VerificationPage.Location.step',
    defaultMessage: 'Step 3',
  },
  location: {
    id: 'dashboard.VerificationPage.Location.location',
    defaultMessage: 'Location',
  },
  address: {
    id: 'dashboard.VerificationPage.Location.address',
    defaultMessage: 'Your Address',
  },
  addressDescription: {
    id: 'dashboard.VerificationPage.Location.addressDescription',
    defaultMessage: 'E.g. Sesame Street 5H, 80-145, New York, USA',
  },
  addressPlaceholder: {
    id: 'dashboard.VerificationPage.Location.addressPlaceholder',
    defaultMessage: `Street name and the home number, postal code, city, country`,
  },
  proofOfAddress: {
    id: 'dashboard.VerificationPage.Location.proofOfAddress',
    defaultMessage: 'Proof of address',
  },
  proofOfAddressExtra: {
    id: 'dashboard.VerificationPage.Location.proofOfAddressExtra',
    defaultMessage: `Upload a utility bill or document confirming the stated address.`,
  },
  proofOfAddressDescription: {
    id: 'dashboard.VerificationPage.Location.proofOfAddressDescription',
    defaultMessage: `Acceptable format: .png, .pdf, .jpg (up to 9 MB)`,
  },
  passportInfo: {
    id: 'dashboard.VerificationPage.Location.passportInfo',
    defaultMessage: `Passport information`,
  },
  passport: {
    id: 'dashboard.VerificationPage.Location.passport',
    defaultMessage: `Passport number`,
  },
  country: {
    id: 'dashboard.VerificationPage.Location.country',
    defaultMessage: 'Country that issued the passport:',
  },
  countryPlaceholder: {
    id: `dashboard.VerificationPage.Location.countryPlaceholder`,
    defaultMessage: 'Select country',
  },
  confirmPassport: {
    id: `dashboard.VerificationPage.Location.confirmPassport`,
    defaultMessage: 'Copy of your passport or official ID',
  },
  confirmPassportAdditional: {
    id: `dashboard.VerificationPage.Location.confirmPassportAdditional`,
    defaultMessage: `Upload a utility bill or document confirming the stated address.`,
  },
  taxCountry: {
    id: `dashboard.VerificationPage.Location.taxCountry`,
    defaultMessage: `Country of tax residency`,
  },
  taxResidency: {
    id: `dashboard.VerificationPage.Location.taxCountry`,
    defaultMessage: `Tax residency`,
  },
  taxID: {
    id: `dashboard.VerificationPage.Location.taxID`,
    defaultMessage: `Tax ID`,
  },
});

export const MIME_TYPES = ['image/png', 'image/jpg', 'text.pdf', 'image/jpeg'];

const displayName = 'dashboard.VerificationPage.Location';

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<Step>>;
}

const Location = ({ setActiveStep }: Props) => {
  const {
    formValues: { location },
    setFormValues,
  } = useVerificationContext();

  const handleSubmit = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        location: values,
      }));
    },
    [setFormValues],
  );

  const handlePrevClick = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        location: values,
      }));
      setActiveStep(Step.Details);
    },
    [setActiveStep, setFormValues],
  );

  const renderActiveOption = useCallback(
    (value) => (_, activeOptionLabel: string) => {
      if (!value) {
        return (
          <span className={styles.placeholder}>
            <FormattedMessage {...MSG.countryPlaceholder} />
          </span>
        );
      }

      return activeOptionLabel;
    },
    [],
  );

  const [shouldValidate, setShouldValidate] = useState(false);
  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  return (
    <Formik
      initialValues={location}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      {({ values, errors }) => (
        <div className={styles.wrapper}>
          <div className={styles.step}>
            <FormattedMessage {...MSG.step} />
          </div>
          <div className={styles.title}>
            <FormattedMessage {...MSG.location} />
          </div>
          <div className={styles.addressWrapper}>
            <div
              className={classNames({
                [styles.textateaError]: errors.address,
              })}
            >
              <Textarea
                name="address"
                label={MSG.address}
                help={MSG.addressDescription}
                placeholder={MSG.addressPlaceholder}
                maxLength={90}
              />
            </div>
            <div
              className={classNames({
                [styles.fileError]: errors.proofOfAddress,
              })}
              data-name="proofOfAddress"
            >
              <FileUpload
                dropzoneOptions={{
                  accept: MIME_TYPES,
                }}
                label={MSG.proofOfAddress}
                maxFilesLimit={1}
                name="proofOfAddress"
                upload={() => {}} // temporary upload function
                maxSize={9437184} // 9MB 526030
                help={MSG.proofOfAddressExtra}
                status={MSG.proofOfAddressDescription}
              />
              {errors.proofOfAddress && (
                <InputStatus
                  error={errors.proofOfAddress[0] as MessageDescriptor}
                />
              )}
            </div>
          </div>
          <div className={styles.title}>
            <FormattedMessage {...MSG.passportInfo} />
          </div>
          <div
            className={classNames(styles.fieldWrapper, {
              [styles.error]: errors.passport,
            })}
          >
            <Input label={MSG.passport} name="passport" />
          </div>
          <div
            className={classNames(styles.selectWrapper, {
              [styles.selectError]: errors.country,
            })}
          >
            <Select
              name="country"
              label={MSG.country}
              options={[
                { label: 'Test', value: 'test' },
                { label: 'Test 2', value: 'test2' },
              ]}
              renderActiveOption={renderActiveOption(values.country)}
              optionSizeLarge
            />
          </div>
          <div
            className={classNames(styles.addressWrapper, {
              [styles.fileError]: errors.confirmPassport,
            })}
          >
            <FileUpload
              dropzoneOptions={{
                accept: MIME_TYPES,
              }}
              label={MSG.confirmPassport}
              maxFilesLimit={1}
              name="confirmPassport"
              upload={() => {}} // temporary upload function
              upload={() => {}} // temporary upload function
              maxSize={9437184} // 9MB
              help={MSG.confirmPassportAdditional}
              status={MSG.proofOfAddressDescription}
            />
          </div>
          <FormButtons
            onNextClick={() => setActiveStep(Step.References)}
            onPrevClick={() => handlePrevClick(values)}
            errorMessage={<ErrorsCounter />}
          />
        </div>
      )}
    </Formik>
  );
};

Location.displayName = displayName;

export default Location;
