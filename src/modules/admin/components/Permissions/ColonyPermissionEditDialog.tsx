/* @flow */

import { FormikProps } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DomainPermissionType } from '~immutable/index';
import { ActionTypeString } from '~redux/index';
import { useSelector } from '~utils/hooks';
import { ActionTransformFnType } from '~utils/actions';

import SingleUserPicker from '~core/SingleUserPicker';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel, Checkbox } from '~core/Fields';

import { allUsersAddressesSelector } from '../../../users/selectors';

import styles from './ColonyPermissionEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.ColonyPermissionEditDialog.title',
    defaultMessage: 'Add New Role in Product',
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
  permissions: DomainPermissionType;
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
  transform?: ActionTransformFnType;
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
  permissions = {},
  cancel,
  close,
  submit,
  error,
  success,
  transform,
}: Props) => {
  const userAddressesInStore = useSelector(allUsersAddressesSelector);
  const userPermissions = Object.values(permissions)[0];
  const availableRoles = Object.keys(userPermissions);
  return (
    <Dialog cancel={cancel}>
      <ActionForm
        initialValues={{
          roles: availableRoles,
        }}
        onSuccess={close}
        submit={submit}
        error={error}
        success={success}
        transform={transform}
      >
        {({ isSubmitting }: FormikProps<any>) => (
          <>
            <DialogSection>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                text={MSG.title}
              />
            </DialogSection>
            <DialogSection>
              <InputLabel label={MSG.selectUser} />
              <SingleUserPicker
                data={userAddressesInStore}
                isResettable
                name="user"
                placeholder={MSG.search}
                filter={supFilter}
              />
            </DialogSection>
            <DialogSection>
              <InputLabel label={MSG.permissionsLabel} />
              <div className={styles.tokenChoiceContainer}>
                {availableRoles.map((role, id) => (
                  <Checkbox
                    key={role}
                    value={role}
                    name="roles"
                    disabled={false}
                  >
                    <span className={styles.tokenChoiceSymbol}>
                      <Heading
                        text={role}
                        appearance={{ size: 'small', margin: 'none' }}
                      />
                      <FormattedMessage {...MSG[`roleDescription${id}`]} />
                    </span>
                  </Checkbox>
                ))}
              </div>
            </DialogSection>
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
          </>
        )}
      </ActionForm>
    </Dialog>
  );
};

ColonyPermissionEditDialog.displayName = 'core.ColonyPermissionEditDialog';

export default ColonyPermissionEditDialog;
