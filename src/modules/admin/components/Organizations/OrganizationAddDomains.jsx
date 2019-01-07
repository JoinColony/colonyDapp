/* @flow */

import React from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionForm, FormStatus, Input } from '~core/Fields';

import {
  COLONY_DOMAIN_ADD,
  COLONY_DOMAIN_ADD_SUCCESS,
  COLONY_DOMAIN_ADD_ERROR,
} from '../../../dashboard/actionTypes';

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
  domain: yup.string().required(),
});

const OrganizationAddDomains = () => (
  <div className={styles.main}>
    <ActionForm
      submit={COLONY_DOMAIN_ADD}
      success={COLONY_DOMAIN_ADD_SUCCESS}
      error={COLONY_DOMAIN_ADD_ERROR}
      validationSchema={validationSchema}
    >
      {({ status, isSubmitting, isValid }) => (
        <div className={styles.inputWrapper}>
          <div className={styles.domainInput}>
            <Input name="domain" label={MSG.labelAddDomain} />
          </div>
          <div className={styles.submitButton}>
            <Button
              appearance={{ theme: 'primary', size: 'medium' }}
              style={{ width: styles.wideButton }}
              text={MSG.buttonAddDomain}
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            />
          </div>
          <FormStatus status={status} />
        </div>
      )}
    </ActionForm>
  </div>
);

OrganizationAddDomains.displayName = displayName;

export default OrganizationAddDomains;
