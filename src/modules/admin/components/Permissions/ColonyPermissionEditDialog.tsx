import { FormikProps } from 'formik';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import {
  COLONY_ROLE_ROOT,
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_RECOVERY,
  COLONY_ROLE_ARBITRATION,
} from '@colony/colony-js-client';

import { Address } from '~types/index';

import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';

import { DomainType, UserType, User, UserProfile } from '~immutable/index';
import { ItemDataType } from '~core/OmniPicker';
import { ActionTypeString, ActionTypes } from '~redux/index';
import {
  useSelector,
  useDataSubscriber,
  useDataMapFetcher,
  useUserDomainRoles,
} from '~utils/hooks';
import { filterUserSelection } from '~utils/arrays';

import { userSubscriber } from '../../../users/subscribers';
import { usersByAddressFetcher } from '../../../users/fetchers';

import SingleUserPicker from '~core/SingleUserPicker';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel, Checkbox } from '~core/Fields';
import HookedUserAvatar from '~users/HookedUserAvatar';

import {
  allUsersAddressesSelector,
  walletAddressSelector,
} from '../../../users/selectors';

import styles from './ColonyPermissionEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.ColonyPermissionEditDialog.title',
    defaultMessage: 'Add New Role in {domain}',
  },
  selectUser: {
    id: 'core.ColonyPermissionEditDialog.selectUser',
    defaultMessage: 'Select Member',
  },
  permissionsLabel: {
    id: 'core.ColonyPermissionEditDialog.permissionsLabel',
    defaultMessage: 'Permissions',
  },
  role0: {
    id: 'core.ColonyPermissionEditDialog.role0',
    defaultMessage: 'Root',
  },
  roleDescription0: {
    id: 'core.ColonyPermissionEditDialog.roleDescription0',
    defaultMessage:
      'The highest permission, control all aspects of running a colony.',
  },
  role1: {
    id: 'core.ColonyPermissionEditDialog.role1',
    defaultMessage: 'Administration',
  },
  roleDescription1: {
    id: 'core.ColonyPermissionEditDialog.roleDescription1',
    defaultMessage: 'Create and manage new tasks.',
  },
  role2: {
    id: 'core.ColonyPermissionEditDialog.role2',
    defaultMessage: 'Architecture',
  },
  roleDescription2: {
    id: 'core.ColonyPermissionEditDialog.roleDescription2',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Set the administration, funding, and architecture roles in any subdomain.',
  },
  role3: {
    id: 'core.ColonyPermissionEditDialog.role3',
    defaultMessage: 'Funding',
  },
  roleDescription3: {
    id: 'core.ColonyPermissionEditDialog.roleDescription3',
    defaultMessage: 'Fund tasks and transfer funds between domains.',
  },
  role4: {
    id: 'core.ColonyPermissionEditDialog.role4',
    defaultMessage: 'Recovery',
  },
  roleDescription4: {
    id: 'core.ColonyPermissionEditDialog.roleDescription4',
    defaultMessage: 'Put the Colony into recovery mode.',
  },
  role5: {
    id: 'core.ColonyPermissionEditDialog.role5',
    defaultMessage: 'Arbitration',
  },
  roleDescription5: {
    id: 'core.ColonyPermissionEditDialog.roleDescription5',
    defaultMessage: 'Coming soon...',
  },
  search: {
    id: 'core.ColonyPermissionEditDialog.search',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  buttonCancel: {
    id: 'core.ColonyPermissionEditDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'core.ColonyPermissionEditDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  domain: DomainType;
  clickedUser?: UserType;
  colonyAddress: Address;
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
}

// Ideally these types would come from colonyJS but can't get it to work
enum Roles {
  ADMINISTRATION = 'ADMINISTRATION',
  ARBITRATION = 'ARBITRATION',
  ARCHITECTURE = 'ARCHITECTURE',
  FUNDING = 'FUNDING',
  RECOVERY = 'RECOVERY',
  ROOT = 'ROOT',
}
type Role = keyof typeof Roles;
type SelectedRoles = Partial<Record<Role, boolean>>;

const availableRoles: Role[] = [
  COLONY_ROLE_ROOT,
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_RECOVERY,
  COLONY_ROLE_ARBITRATION,
];

const validationSchema = yup.object({
  user: yup.object().required(),
  roles: yup.array().of(yup.string().required()),
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...user } = item;
  return <UserAvatar address={address} user={user} size="xs" />;
};

const ColonyPermissionEditDialog = ({
  domain,
  clickedUser,
  colonyAddress,
  cancel,
  close,
}: Props) => {
  // Prepare userData for SingleUserPicker
  const userAddressesInStore = useSelector(allUsersAddressesSelector);

  const userData = useDataMapFetcher<UserType>(
    usersByAddressFetcher,
    Array.from(userAddressesInStore),
  );

  const users = useMemo(
    () =>
      userData
        .filter(({ data }) => !!data)
        .map(({ data, key }) => ({
          id: key,
          ...data,
        })),
    [userData],
  );

  // Get the current user's roles in the selected domain
  const currentUserAddress = useSelector(walletAddressSelector);
  const { data: currentUserDomainRoles } = useUserDomainRoles(
    colonyAddress,
    domain.id,
    currentUserAddress,
    true,
  );

  // Check which roles the current user is allowed to set in this domain
  const checkIfCanBeSet = useCallback(
    (role: Role) => {
      switch (role) {
        // Can't set arbitration at all yet
        case COLONY_ROLE_ARBITRATION:
          return false;

        // Can only be set by root and in root domain
        case COLONY_ROLE_ROOT:
        case COLONY_ROLE_RECOVERY:
          return domain.id === 1 && !!currentUserDomainRoles[COLONY_ROLE_ROOT];

        // Must be root for these
        case COLONY_ROLE_ADMINISTRATION:
        case COLONY_ROLE_FUNDING:
        case COLONY_ROLE_ARCHITECTURE:
          return !!currentUserDomainRoles[COLONY_ROLE_ROOT];

        default:
          return false;
      }
    },
    [currentUserDomainRoles, domain.id],
  );

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({
        userAddress: p.user.profile.walletAddress,
        domainId: domain.id,
        colonyAddress,
        roles: availableRoles.reduce(
          (acc, role) => ({
            ...acc,
            [role]: p.roles.includes(role),
          }),
          {},
        ),
      })),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress, domain],
  );

  const [selectedUser, setSelectedUser] = useState();
  const [selectedRoles, setSelectedRoles] = useState({});
  const [userRoles, setUserRoles] = useState([] as Role[]);

  // When user clicked on a specific user entry
  useEffect(() => {
    setSelectedUser(clickedUser);
  }, [clickedUser]);

  const updateSelectedUser = useCallback(({ profile: { walletAddress } }) => {
    setSelectedUser(walletAddress);
  }, []);

  const getRoles = (roles: SelectedRoles): Role[] =>
    Object.keys(roles).filter(role => roles[role]) as Role[];

  // When selected user gets updates get that user's roles
  // to populate the checkboxes
  const { data } = useUserDomainRoles(colonyAddress, domain.id, selectedUser);

  useEffect(() => {
    // Avoid too many rerenders when no new data has loaded with the following condition
    if (
      selectedRoles &&
      Object.keys(selectedRoles).length !== Object.keys(data).length &&
      selectedUser
    ) {
      setSelectedRoles(data);

      setUserRoles(getRoles(data));
    }
  }, [data, selectedRoles, selectedUser]);

  // Set user whose roles should be edited
  const {
    data: selectedUserObj,
    isFetching: isFetchingselectedUser,
  } = useDataSubscriber<UserType>(
    userSubscriber,
    [selectedUser],
    [selectedUser],
  );
  const selectedUserData =
    !!selectedUser && !selectedUserObj
      ? User({
          profile: UserProfile({
            walletAddress: selectedUser,
          }),
        }).toJS()
      : selectedUserObj;

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        enableReinitialize
        initialValues={{
          domainId: domain.id,
          roles: userRoles,
          user: !isFetchingselectedUser && selectedUserData,
        }}
        onSuccess={close}
        submit={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET}
        error={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR}
        success={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS}
        transform={transform}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid }: FormikProps<any>) => {
          return (
            <div className={styles.dialogContainer}>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                text={MSG.title}
                textValues={{ domain: domain.name }}
              />
              <div className={styles.titleContainer}>
                <InputLabel label={MSG.selectUser} />
                <SingleUserPicker
                  appearance={{ width: 'wide' }}
                  data={users}
                  isResettable
                  name="user"
                  placeholder={MSG.search}
                  filter={filterUserSelection}
                  onSelected={user => updateSelectedUser(user)}
                  renderAvatar={supRenderAvatar}
                />
              </div>
              <InputLabel label={MSG.permissionsLabel} />
              {availableRoles.map((role, id) => (
                <div key={role} className={styles.permissionChoiceContainer}>
                  <Checkbox
                    className={styles.permissionChoice}
                    value={role}
                    name="roles"
                    disabled={!checkIfCanBeSet(role)}
                  >
                    <span className={styles.permissionChoiceDescription}>
                      <Heading
                        text={MSG[`role${id}`]}
                        appearance={{ size: 'small', margin: 'none' }}
                      />
                      <FormattedMessage {...MSG[`roleDescription${id}`]} />
                    </span>
                  </Checkbox>
                </div>
              ))}
              <DialogSection appearance={{ align: 'right' }}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={MSG.buttonCancel}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  loading={isSubmitting}
                  text={MSG.buttonConfirm}
                  disabled={!isValid}
                  type="submit"
                />
              </DialogSection>
            </div>
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

ColonyPermissionEditDialog.displayName = 'core.ColonyPermissionEditDialog';

export default ColonyPermissionEditDialog;
