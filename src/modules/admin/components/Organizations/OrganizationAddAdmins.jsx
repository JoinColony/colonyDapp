/* @flow */

import React, { Fragment } from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import type { UserType } from '~immutable';
import type { ENSName } from '~types';

import { withKeyPath } from '~utils/actions';
import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { ACTIONS } from '~redux';

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

const supFilter = (data, filterValue) => {
  const filtered = data.filter(
    user =>
      user &&
      filterValue &&
      user.profile.username.toLowerCase().includes(filterValue.toLowerCase()),
  );

  if (!filterValue) return filtered;

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};
const ItemWithAddress = props => <ItemDefault showMaskedAddress {...props} />;

const displayName: string = 'admin.Organizations.OrganizationAddAdmins';

// Validate the value we get back from SingleUserPicker
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

const transformAction = action => ({
  ...action,
  payload: {
    ...action.payload,
    newAdmin: action.payload.newAdmin.profile.walletAddress,
  },
});

const OrganizationAddAdmins = ({ availableUsers, ensName }: Props) => (
  <div className={styles.main}>
    <ActionForm
      submit={ACTIONS.COLONY_ADMIN_ADD}
      success={ACTIONS.COLONY_ADMIN_ADD_SUCCESS}
      error={ACTIONS.COLONY_ADMIN_ADD_ERROR}
      validationSchema={validationSchema}
      transform={withKeyPath(ensName)(transformAction)}
      initialValues={{
        newAdmin: null,
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
              filter={supFilter}
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
