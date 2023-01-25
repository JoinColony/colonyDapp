import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Formik } from 'formik';

import { Input, InputLabel, Radio } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { useLoggedInUser } from '~data/helpers';
import { Step } from '~pages/VerificationPage/types';
import { useVerificationContext } from '~pages/VerificationPage/VerificationDataContext';

import FormButtons from '../FormButtons/FormButtons';

import styles from './Details.css';

export const MSG = defineMessages({
  step: {
    id: 'dashboard.VerificationPage.Details.step',
    defaultMessage: 'Step 2',
  },
  details: {
    id: 'dashboard.VerificationPage.Details.details',
    defaultMessage: 'Details',
  },
  username: {
    id: 'dashboard.VerificationPage.Details.username',
    defaultMessage: 'Your colony username',
  },
  name: {
    id: 'dashboard.VerificationPage.Details.name',
    defaultMessage: 'Name',
  },
  phone: {
    id: 'dashboard.VerificationPage.Details.phone',
    defaultMessage: 'Telephone',
  },
  email: {
    id: 'dashboard.VerificationPage.Details.email',
    defaultMessage: 'Email',
  },
  businessActivity: {
    id: 'dashboard.VerificationPage.Details.businessActivity',
    defaultMessage: 'What is your main business activity?',
  },
  businessActivityDescription: {
    id: `dashboard.VerificationPage.Details.businessActivityDescription`,
    defaultMessage: 'E.g. your day-to-day job',
  },
  describeActivity: {
    id: `dashboard.VerificationPage.Details.describeActivity`,
    defaultMessage: 'Describe the activity that generates your income?',
  },
  describeActivityDescription: {
    id: `dashboard.VerificationPage.Details.describeActivityDescription`,
    defaultMessage: 'E.g. details about your full time job',
  },
  country: {
    id: `dashboard.VerificationPage.Details.country`,
    defaultMessage: 'Country where said activity is performed',
  },
  pep: {
    id: `dashboard.VerificationPage.Details.pep`,
    defaultMessage: 'Are you a Politically Exposed Person (PEP) ?',
  },
  yes: {
    id: `dashboard.VerificationPage.Details.yes`,
    defaultMessage: 'Yes',
  },
  no: {
    id: `dashboard.VerificationPage.Details.no`,
    defaultMessage: 'No',
  },
  countryPlaceholder: {
    id: `dashboard.VerificationPage.Details.countryPlaceholder`,
    defaultMessage: 'Select country',
  },
});

const displayName = 'dashboard.VerificationPage.Details';

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<Step>>;
}

const Details = ({ setActiveStep }: Props) => {
  const { walletAddress, username } = useLoggedInUser();
  const {
    formValues: { details },
    setFormValues,
  } = useVerificationContext();

  const handleSubmit = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        details: values,
      }));
    },
    [setFormValues],
  );

  const handlePrevClick = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        details: values,
      }));
      setActiveStep(Step.About);
    },
    [setActiveStep, setFormValues],
  );

  return (
    <Formik initialValues={details} onSubmit={handleSubmit}>
      {({ values }) => (
        <div className={styles.wrapper}>
          <div className={styles.step}>
            <FormattedMessage {...MSG.step} />
          </div>
          <div className={styles.title}>
            <FormattedMessage {...MSG.details} />
          </div>
          <div className={styles.userWrapper}>
            <InputLabel label={MSG.username} />
            <div className={styles.userAvatarContainer}>
              <UserAvatar address={walletAddress} size="xs" notSet={false} />
              <div className={styles.userName}>
                <UserMention username={username || ''} />
              </div>
            </div>
          </div>
          <div className={styles.fieldWrapper}>
            <Input label={MSG.name} name="name" />
          </div>
          <div className={styles.fieldWrapper}>
            <Input label={MSG.phone} name="phone" />
          </div>
          <div className={styles.fieldWrapper}>
            <Input label={MSG.email} name="email" />
          </div>
          <div className={styles.radioButtonsWrapper}>
            <div className={styles.textWrapper}>
              <FormattedMessage {...MSG.pep} />
            </div>
            <div className={styles.radioGroup}>
              <div
                className={classNames(styles.radioWrapper, {
                  [styles.selected]: values.pep === 'no',
                })}
              >
                <Radio
                  name="pep"
                  value="no"
                  checked={values.pep === 'no'}
                  elementOnly
                >
                  <FormattedMessage {...MSG.no} />
                </Radio>
              </div>
              <div
                className={classNames(styles.radioWrapper, {
                  [styles.selected]: values.pep === 'yes',
                })}
              >
                <Radio
                  name="pep"
                  value="yes"
                  checked={values.pep === 'yes'}
                  elementOnly
                >
                  <FormattedMessage {...MSG.yes} />
                </Radio>
              </div>
            </div>
          </div>
          <FormButtons
            onNextClick={() => setActiveStep(Step.Location)}
            onPrevClick={() => handlePrevClick(values)}
          />
        </div>
      )}
    </Formik>
  );
};

Details.displayName = displayName;

export default Details;
