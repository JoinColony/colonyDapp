/* @flow */

import React, { Fragment } from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import type { ENSName } from '~types';
import type { UserType } from '~immutable';
import type { ItemDataType } from '~core/OmniPicker';

import { withKeyPath } from '~utils/actions';
import { useSelector } from '~utils/hooks';
import { ACTIONS } from '~redux';
import SingleUserPicker from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import HookedUserAvatar from '~users/HookedUserAvatar';

import {
  walletAddressSelector,
  usersExceptSelector,
} from '../../../users/selectors';

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

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supFiler = (data, filterValue) => {
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

const supRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  const { id, ...user } = item;
  return <UserAvatar address={address} user={user} size="xs" />;
};

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
  ensName: ENSName,
|};

const transformAction = action => ({
  ...action,
  payload: {
    ...action.payload,
    newAdmin: action.payload.newAdmin.profile.walletAddress,
  },
});

const OrganizationAddAdmins = ({ ensName }: Props) => {
  const walletAddress = useSelector(walletAddressSelector);
  const knownUsers = useSelector(usersExceptSelector, [walletAddress]);
  return (
    <div className={styles.main}>
      <ActionForm
        submit={ACTIONS.COLONY_ADMIN_ADD}
        success={ACTIONS.COLONY_ADMIN_ADD_SUCCESS}
        error={ACTIONS.COLONY_ADMIN_ADD_ERROR}
        validationSchema={validationSchema}
        transform={withKeyPath(ensName)(transformAction)}
        initialValues={{
          newAdmin: null,
          colonyENSName: ensName,
        }}
      >
        {({ status, isSubmitting, isValid }) => (
          <Fragment>
            <div className={styles.pickerWrapper}>
              <SingleUserPicker
                name="newAdmin"
                label={MSG.labelAddAdmins}
                placeholder={MSG.placeholderAddAdmins}
                data={knownUsers.map(user => ({
                  ...user,
                  id: user.profile.walletAddress,
                }))}
                filter={supFiler}
                renderAvatar={supRenderAvatar}
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
};

OrganizationAddAdmins.displayName = displayName;

export default OrganizationAddAdmins;
