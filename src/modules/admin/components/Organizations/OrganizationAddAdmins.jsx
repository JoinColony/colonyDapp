/* @flow */

import React, { Fragment } from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import type { UserType } from '~immutable';
import type { ENSName } from '~types';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';

import {
  COLONY_ADMIN_ADD,
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_ADD_ERROR,
} from '../../../dashboard/actionTypes';

import styles from './OrganizationAddAdmins.css';

const MSG = defineMessages({
  labelAddAdmins: {
    id: 'admin.Organizations.OrganizationAddAdmins.labelAddAdmins',
    defaultMessage: 'Add new admin',
  },
  placeholderAddAdmins: {
    id: 'admin.Organizations.OrganizationAddAdmins.placeholderAddAdmins',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  buttonAddAdmin: {
    id: 'admin.Organizations.OrganizationAddAdmins.buttonAddAdmin',
    defaultMessage: 'Add Admin',
  },
});

const filter = (data, filterValue) =>
  data.filter(
    user =>
      user &&
      filterValue &&
      user.profile.username.toLowerCase().includes(filterValue.toLowerCase()),
  );
const ItemWithAddress = props => <ItemDefault showMaskedAddress {...props} />;

const displayName: string = 'admin.Organizations.OrganizationAddAdmins';

const validationSchema = yup.object({
  newAdmin: yup
    .object()
    .shape({
      id: yup.string(),
      username: yup.string(),
      fullname: yup.string(),
    })
    .required(),
});

type Props = {|
  availableUsers: Array<UserType>,
  ensName: ENSName,
|};

const OrganizationAddAdmins = ({ availableUsers, ensName }: Props) => (
  <div className={styles.main}>
    <ActionForm
      submit={COLONY_ADMIN_ADD}
      success={COLONY_ADMIN_ADD_SUCCESS}
      error={COLONY_ADMIN_ADD_ERROR}
      validationSchema={validationSchema}
      initialValues={{
        newAdmin: '',
        ensName,
      }}
    >
      {({ status, isSubmitting, isValid }) => (
        <Fragment>
          <div className={styles.pickerWrapper}>
            <SingleUserPicker
              name="newAdmin"
              label={MSG.labelAddAdmins}
              placeholder={MSG.placeholderAddAdmins}
              itemComponent={ItemWithAddress}
              data={availableUsers}
              filter={filter}
            />
          </div>
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            style={{ width: styles.wideButton }}
            text={MSG.buttonAddAdmin}
            type="submit"
            disabled={!isValid}
            loading={isSubmitting}
          />
          <FormStatus status={status} />
        </Fragment>
      )}
    </ActionForm>
  </div>
);

OrganizationAddAdmins.displayName = displayName;

export default OrganizationAddAdmins;
