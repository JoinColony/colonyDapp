/* @flow */

import React from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import type { ENSName } from '~types';
import type { UniqueActionType } from '~redux';

import Button from '~core/Button';
import { ActionForm, FormStatus, Input } from '~core/Fields';
import { ACTIONS } from '~redux';

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
  domainName: yup
    .string()
    .domainName()
    .required(),
});

const OrganizationAddDomains = ({ ensName }: Props) => (
  <div className={styles.main}>
    <ActionForm
      setPayload={(
        action: UniqueActionType<*, *, *>,
        { domainName }: FormValues,
      ) => ({
        ...action,
        payload: {
          domainName,
        },
        meta: {
          keyPath: [ensName],
        },
      })}
      submit={ACTIONS.DOMAIN_CREATE}
      success={ACTIONS.DOMAIN_CREATE_SUCCESS}
      error={ACTIONS.DOMAIN_CREATE_ERROR}
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
