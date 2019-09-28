import { FormikProps } from 'formik';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { Address, ColonyRoles } from '~types/index';
import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';
import { UserType } from '~immutable/index';
import { ItemDataType } from '~core/OmniPicker';
import { ActionTypeString, ActionTypes } from '~redux/index';
import {
  useSelector,
  useDataSubscriber,
  useDataMapFetcher,
} from '~utils/hooks';
import { filterUserSelection } from '~utils/arrays';

import PermissionCheckbox from './PermissionCheckbox';

import SingleUserPicker from '~core/SingleUserPicker';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import HookedUserAvatar from '~users/HookedUserAvatar';

import {
  domainSelector,
  directRolesSelector,
  inheritedRolesSelector,
} from '../../../dashboard/selectors';
import { userSubscriber } from '../../../users/subscribers';
import { usersByAddressFetcher } from '../../../users/fetchers';
import {
  allUsersAddressesSelector,
  walletAddressSelector,
} from '../../../users/selectors';

import styles from './ColonyPermissionEditDialog.css';

const DOMAINS_HELP_URL =
  // eslint-disable-next-line max-len
  'https://help.colony.io/hc/en-us/articles/360024588993-What-are-the-permissions-in-a-colony-';

const MSG = defineMessages({
  title: {
    id: 'admin.ColonyPermissionEditDialog.title',
    defaultMessage: 'Add New Role in {domain}',
  },
  selectUser: {
    id: 'admin.ColonyPermissionEditDialog.selectUser',
    defaultMessage: 'Select Member',
  },
  permissionsLabel: {
    id: 'admin.ColonyPermissionEditDialog.permissionsLabel',
    defaultMessage: 'Permissions',
  },
  search: {
    id: 'admin.ColonyPermissionEditDialog.search',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  permissionInParent: {
    id: 'admin.ColonyPermissionEditDialog.permissionInParent',
    defaultMessage: '*Permission granted via parent domain. {learnMore}',
  },
  learnMore: {
    id: 'admin.ColonyPermissionEditDialog.learnMore',
    defaultMessage: 'Learn more',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  domainId: string;
  clickedUser?: Address;
  colonyAddress: Address;
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
}

const availableRoles: ColonyRoles[] = [
  ColonyRoles.ROOT,
  ColonyRoles.ADMINISTRATION,
  ColonyRoles.ARCHITECTURE,
  ColonyRoles.FUNDING,
  ColonyRoles.RECOVERY,
  ColonyRoles.ARBITRATION,
];

const validationSchema = yup.object({
  user: yup.object().required(),
  roles: yup.array().of(yup.number().required()),
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...user } = item;
  return <UserAvatar address={address} user={user} size="xs" />;
};

const ColonyPermissionEditDialog = ({
  clickedUser,
  colonyAddress,
  cancel,
  close,
  domainId,
}: Props) => {
  const [selectedUserAddress, setSelectedUser] = useState<
    Address | undefined
  >();

  // Overwrite the selected user whenever the prop changes
  useEffect(() => {
    setSelectedUser(clickedUser);
  }, [clickedUser]);

  // Prepare userData for SingleUserPicker
  const userAddressesInStore = useSelector(allUsersAddressesSelector);
  const userData = useDataMapFetcher(
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
  const walletAddress = useSelector(walletAddressSelector);
  const inheritedRoles = useSelector(inheritedRolesSelector, [
    colonyAddress,
    domainId,
    walletAddress,
  ]);
  const directRoles = useSelector(directRolesSelector, [
    colonyAddress,
    domainId,
    walletAddress,
  ]);

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = useCallback(
    (role: ColonyRoles) => {
      switch (role) {
        // Can't set arbitration at all yet
        case ColonyRoles.ARBITRATION:
          return false;

        // Can only be set by root and in root domain
        case ColonyRoles.ROOT:
        case ColonyRoles.RECOVERY:
          return domainId === '1' && inheritedRoles.has(ColonyRoles.ROOT);

        // Must be root for these
        case ColonyRoles.ADMINISTRATION:
        case ColonyRoles.FUNDING:
        case ColonyRoles.ARCHITECTURE:
          return inheritedRoles.has(ColonyRoles.ROOT);

        default:
          return false;
      }
    },
    [inheritedRoles, domainId],
  );

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({
        userAddress: p.user.profile.walletAddress,
        domainId,
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
    [colonyAddress, domainId],
  );

  const domain = useSelector(domainSelector, [colonyAddress, domainId]);

  const updateSelectedUser = useCallback((user: UserType) => {
    setSelectedUser(user.profile.walletAddress);
  }, []);

  const roles: ColonyRoles[] = selectedUserAddress
    ? [...((domain && domain.roles[selectedUserAddress]) || [])]
    : [];

  // Set user whose roles should be edited
  const {
    data: selectedUserData,
    isFetching: isFetchingselectedUser,
  } = useDataSubscriber(userSubscriber, [selectedUserAddress] as [string], [
    selectedUserAddress,
  ]);

  const selectedUser = selectedUserData || {
    profile: {
      walletAddress: selectedUserAddress,
    },
  };

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        enableReinitialize
        initialValues={{
          domainId,
          roles,
          user: !isFetchingselectedUser && selectedUser,
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
                textValues={{ domain: domain && domain.name }}
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
                  onSelected={updateSelectedUser}
                  renderAvatar={supRenderAvatar}
                />
              </div>
              <InputLabel label={MSG.permissionsLabel} />
              {availableRoles.map(role => (
                <div key={role} className={styles.permissionChoiceContainer}>
                  <PermissionCheckbox
                    disabled={!canRoleBeSet(role)}
                    role={role}
                    asterisk={
                      !directRoles.has(role) && inheritedRoles.has(role)
                    }
                  />
                </div>
              ))}
              <p className={styles.parentPermissionTip}>
                <FormattedMessage
                  {...MSG.permissionInParent}
                  values={{
                    learnMore: (
                      <ExternalLink
                        text={MSG.learnMore}
                        href={DOMAINS_HELP_URL}
                      />
                    ),
                  }}
                />
              </p>
              <DialogSection appearance={{ align: 'right' }}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={{ id: 'button.cancel' }}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  loading={isSubmitting}
                  text={{ id: 'button.confirm' }}
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

ColonyPermissionEditDialog.displayName = 'admin.ColonyPermissionEditDialog';

export default ColonyPermissionEditDialog;
