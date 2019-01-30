/* @flow */

import React from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import type { Action, ENSName } from '~types';

import Button from '~core/Button';
import { ActionForm, FormStatus, Input } from '~core/Fields';

import {
  DOMAIN_CREATE,
  DOMAIN_CREATE_SUCCESS,
  DOMAIN_CREATE_ERROR,
} from '../../../dashboard/actionTypes';

import styles from './OrganizationAddDomains.css';

type Props = {
  ensName: ENSName,
};

type FormValues = {
  domainName: string,
};

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
  domainName: yup.string().required(),
});

const OrganizationAddDomains = ({ ensName }: Props) => (
  <div className={styles.main}>
    <ActionForm
      setPayload={(action: Action, { domainName }: FormValues) => ({
        ...action,
        payload: {
          domainName,
        },
        meta: {
          keyPath: [ensName],
        },
      })}
      submit={DOMAIN_CREATE}
      success={DOMAIN_CREATE_SUCCESS}
      error={DOMAIN_CREATE_ERROR}
      onSuccess={(_, { resetForm }) => {
        resetForm();
      }}
      initialValues={{
        domainName: '',
      }}
      validationSchema={validationSchema}
    >
      {({ status, isSubmitting, isValid }) => (
        <div className={styles.inputWrapper}>
          <div className={styles.domainInput}>
            <Input name="domainName" label={MSG.labelAddDomain} />
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
