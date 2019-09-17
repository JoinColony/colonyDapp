import React, { useCallback } from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { pipe, mergePayload, withKey } from '~utils/actions';
import Button from '~core/Button';
import { ActionForm, FormStatus, Input } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import styles from './OrganizationAddDomains.css';

interface Props {
  colonyAddress: Address;
}

const MSG = defineMessages({
  labelAddDomain: {
    id: 'admin.Domains.OrganizationAddDomains.labelAddDomain',
    defaultMessage: 'Add New Domain',
  },
  helpText: {
    id: 'admin.Organizations.OrganizationAddDomains.helpText',
    defaultMessage: 'This cannot be undone',
  },
  buttonAddDomain: {
    id: 'admin.Domains.OrganizationAddDomains.buttonAddDomain',
    defaultMessage: 'Add Domain',
  },
});

const displayName = 'admin.Domains.OrganizationAddDomains';

const validationSchema = yup.object({
  domainName: yup.string().required(),
});

const OrganizationAddDomains = ({ colonyAddress }: Props) => {
  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress],
  );
  return (
    <div className={styles.main}>
      <ActionForm
        submit={ActionTypes.DOMAIN_CREATE}
        success={ActionTypes.DOMAIN_CREATE_SUCCESS}
        error={ActionTypes.DOMAIN_CREATE_ERROR}
        onSuccess={(_, { resetForm }) => {
          resetForm();
        }}
        transform={transform}
        initialValues={{
          domainName: '',
        }}
        validationSchema={validationSchema}
      >
        {({ status, isSubmitting, isValid }) => (
          <div className={styles.inputWrapper}>
            <div className={styles.domainInput}>
              <Input
                appearance={{ helpAlign: 'right', theme: 'fat' }}
                help={MSG.helpText}
                label={MSG.labelAddDomain}
                name="domainName"
              />
            </div>
            <div className={styles.submitButton}>
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
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
};

OrganizationAddDomains.displayName = displayName;

export default OrganizationAddDomains;
