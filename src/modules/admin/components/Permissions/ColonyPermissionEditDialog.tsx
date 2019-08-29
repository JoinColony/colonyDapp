import { FormikProps } from 'formik';

import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';

import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';

import { DomainType } from '~immutable/index';
import { ActionTypeString, ActionTypes } from '~redux/index';
import { useSelector, useDataMapFetcher } from '~utils/hooks';

import { usersByAddressFetcher } from '../../../users/fetchers';

import SingleUserPicker from '~core/SingleUserPicker';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel, Checkbox } from '~core/Fields';

import { allUsersAddressesSelector } from '../../../users/selectors';

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
  roleDescription0: {
    id: 'core.ColonyPermissionEditDialog.roleDescription0',
    defaultMessage:
      'The highest permission, control all aspects of running a colony.',
  },
  roleDescription1: {
    id: 'core.ColonyPermissionEditDialog.roleDescription1',
    defaultMessage: 'Create and manage new tasks.',
  },
  roleDescription2: {
    id: 'core.ColonyPermissionEditDialog.roleDescription2',
    defaultMessage: 'Set the administration, funding, and architecture roles.',
  },
  roleDescription3: {
    id: 'core.ColonyPermissionEditDialog.roleDescription3',
    defaultMessage: 'Fund tasks and transfer funds between domains.',
  },
  roleDescription4: {
    id: 'core.ColonyPermissionEditDialog.roleDescription3',
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
  colonyAddress: Address;
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
}

const supFilter = (data, filterValue) => {
  if (!filterValue) {
    return data;
  }

  const filtered = data.filter(
    user =>
      user &&
      filterValue &&
      (user.profile.username
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
        user.profile.walletAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase())),
  );

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};

const ColonyPermissionEditDialog = ({
  domain,
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

  /* const userPermissions = Object.values(permissions)[0];
  const availableRoles = Object.keys(userPermissions); */

  // This will be coming from the fetched data of the permissions screen
  const roles = [
    'Root',
    'Administration',
    'Architecture',
    'Funding',
    'Arbitration',
  ];

  /* Currently arbitration should appear in the list of roles
    but can not be set yet
   */
  const checkIfCanBeSet = role => {
    return role !== 'Arbitration' || role !== 'Root';
  };

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({
        userAddress: p.user.profile.walletAddress,
        domainId: p.domainId,
        roles: p.roles.reduce((accumulator, role) => {
          if (checkIfCanBeSet(role)) {
            accumulator[role.toUpperCase()] = true;
          }
          return accumulator;
        }, {}),
      })),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress],
  );

  // When updating the selected user fetch that user's Roles

  /* const userRoles = useUserDomainRoles(
    colonyAddress,
    domain.id,
    '0x9F2f9863d091eF86801afaae6F4d6DBEFC772790',
  ); */

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        initialValues={{
          domainId: domain.id,
          colonyAddress,
          roles,
          userAddress: null,
        }}
        onSuccess={close}
        submit={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET}
        error={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR}
        success={ActionTypes.COLONY_DOMAIN_USER_ROLES_SUCCESS}
        transform={transform}
      >
        {({ isSubmitting }: FormikProps<any>) => {
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
                  data={users}
                  isResettable
                  name="user"
                  placeholder={MSG.search}
                  filter={supFilter}
                />
              </div>
              <InputLabel label={MSG.permissionsLabel} />
              {roles.map((role, id) => (
                <div className={styles.permissionChoiceContainer}>
                  <Checkbox
                    className={styles.permissionChoice}
                    key={role}
                    value={role}
                    name="roles"
                    disabled={!checkIfCanBeSet(role)}
                  >
                    <span className={styles.permissionChoiceDescription}>
                      <Heading
                        text={role}
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
