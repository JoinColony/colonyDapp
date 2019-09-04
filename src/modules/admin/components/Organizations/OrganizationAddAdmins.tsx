import React, { useCallback } from 'react';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { UserType } from '~immutable/index';
import { ItemDataType } from '~core/OmniPicker';
import { pipe, mapPayload, mergePayload, withKey } from '~utils/actions';
import { useSelector } from '~utils/hooks';
import { filterUserSelection } from '~utils/arrays';
import { ActionTypes } from '~redux/index';
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
    defaultMessage: 'Add New Admin',
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

const supRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...user } = item;
  return <UserAvatar address={address} user={user} size="xs" />;
};

const displayName = 'admin.Organizations.OrganizationAddAdmins';

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

interface Props {
  colonyAddress: Address;
}

const OrganizationAddAdmins = ({ colonyAddress }: Props) => {
  const walletAddress = useSelector(walletAddressSelector);
  const knownUsers = useSelector(usersExceptSelector, [walletAddress]);
  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({ newAdmin: p.newAdmin.profile.walletAddress })),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress],
  );
  return (
    <div className={styles.main}>
      <ActionForm
        submit={ActionTypes.COLONY_ADMIN_ADD}
        success={ActionTypes.COLONY_ADMIN_ADD_SUCCESS}
        error={ActionTypes.COLONY_ADMIN_ADD_ERROR}
        validationSchema={validationSchema}
        transform={transform}
        initialValues={{
          newAdmin: null,
        }}
        onSuccess={(_, { resetForm }) => {
          resetForm();
        }}
      >
        {({ status, isSubmitting, isValid }) => (
          <>
            <div className={styles.pickerWrapper}>
              <SingleUserPicker
                disabled={isSubmitting}
                name="newAdmin"
                label={MSG.labelAddAdmins}
                placeholder={MSG.placeholderAddAdmins}
                data={knownUsers.map(user => ({
                  ...user,
                  id: user.profile.walletAddress,
                }))}
                filter={filterUserSelection}
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
          </>
        )}
      </ActionForm>
    </div>
  );
};

OrganizationAddAdmins.displayName = displayName;

export default OrganizationAddAdmins;
