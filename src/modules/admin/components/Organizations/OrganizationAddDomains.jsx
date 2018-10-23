/* @flow */
import type { FormikProps } from 'formik';

import React from 'react';
import { Form } from '~core/Fields';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Input from '~core/Fields/Input';

import styles from './OrganizationAddDomains.css';

const MSG = defineMessages({
  labelAddDomain: {
    id: 'admin.Organizations.OrganizationAddDomains.labelAddDomain',
    defaultMessage: 'Add New Domain',
  },
  placeholderAddDomains: {
    id: 'admin.Organizations.OrganizationAddDomains.placeholderAddDomains',
    defaultMessage: 'Type a domain name',
  },
  buttonAddDomain: {
    id: 'admin.Organizations.OrganizationAddDomains.buttonAddDomain',
    defaultMessage: 'Add Domain',
  },
});

const displayName: string = 'admin.Organizations.OrganizationAddDomains';

const validationSchema = yup.object({
  domainName: yup.string().required(),
});

type FormValues = {
  domainName: string,
};

const OrganizationAddDomains = () => (
  <div className={styles.main}>
    <Form
      initialValues={{
        domainName: '',
      }}
      onSubmit={console.log}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isValid, handleChange }: FormikProps<FormValues>) => (
        <div onSubmit={handleSubmit} className={styles.inputWrapper}>
          <div className={styles.domainInput}>
            <Input
              appearance={{ theme: 'fat' }}
              name="domainName"
              label={MSG.labelAddDomain}
              onChange={handleChange}
            />
          </div>
          <div className={styles.submitButton}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              style={{ width: styles.wideButton }}
              text={MSG.buttonAddDomain}
              type="submit"
              disabled={!isValid}
            />
          </div>
        </div>
      )}
    </Form>
  </div>
);

OrganizationAddDomains.displayName = displayName;

export default OrganizationAddDomains;
