/* @flow */

import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Input from '~core/Fields/Input';

import type { FormikProps } from 'formik';
import styles from './OrganizationAddDomains.css';

const MSG = defineMessages({
  labelAddDomain: {
    id: 'admin.Organizations.OrganizationAddDomains.labelAddDomain',
    defaultMessage: 'Add New Domain',
  },
  placeholderAddAdmins: {
    id: 'admin.Organizations.OrganizationAddDomains.placeholderAddAdmins',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  buttonAddDomain: {
    id: 'admin.Organizations.OrganizationAddDomains.buttonAddDomain',
    defaultMessage: 'Add Domain',
  },
});

const displayName: string = 'admin.Organizations.OrganizationAddDomains';

const validationSchema = yup.object({
  domain: yup
    .object()
    .shape({
      domainName: yup.string(),
    })
    .required(),
});

type FormValues = {
  domainName: UserData,
};

const OrganizationAddDomains = () => (
  <div className={styles.main}>
    <Formik onSubmit={console.log} validationSchema={validationSchema}>
      {({ handleSubmit, isValid }: FormikProps<FormValues>) => (
        <form onSubmit={handleSubmit} className={styles.inputWrapper}>
          <div className={styles.domainInput}>
            <Input
              name="domainName"
              label={MSG.labelAddDomain}
              connect={false}
            />
          </div>
          <div className={styles.submitButton}>
            <Button
              appearance={{ theme: 'primary', size: 'medium' }}
              style={{ width: styles.wideButton }}
              text={MSG.buttonAddDomain}
              type="submit"
              disabled={!isValid}
            />
          </div>
        </form>
      )}
    </Formik>
  </div>
);

OrganizationAddDomains.displayName = displayName;

export default OrganizationAddDomains;
