import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import Snackbar, { SnackbarType } from '~core/Snackbar';
import CopyableAddress from '~core/CopyableAddress';
import UserMention from '~core/UserMention';
import Heading from '~core/Heading';
import {
  FieldSet,
  Form,
  FormStatus,
  Input,
  InputLabel,
  Textarea,
} from '~core/Fields';
import Button from '~core/Button';
import ConfusableWarning from '~core/ConfusableWarning';

import { useLoggedInUser, useUser, useEditUserMutation, AnyUser } from '~data/index';

import styles from './UserProfileEdit.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.UserMainSettings.heading',
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: 'users.UserProfileEdit.UserMainSettings.labelWallet',
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: 'users.UserProfileEdit.UserMainSettings.labelUsername',
    defaultMessage: 'Unique Username',
  },
  labelName: {
    id: 'users.UserProfileEdit.UserMainSettings.labelName',
    defaultMessage: 'Name',
  },
  labelBio: {
    id: 'users.UserProfileEdit.UserMainSettings.labelBio',
    defaultMessage: 'Bio',
  },
  labelWebsite: {
    id: 'users.UserProfileEdit.UserMainSettings.labelWebsite',
    defaultMessage: 'Website',
  },
  labelLocation: {
    id: 'users.UserProfileEdit.UserMainSettings.labelLocation',
    defaultMessage: 'Location',
  },
  snackbarSuccess: {
    id: 'users.UserProfileEdit.UserMainSettings.snackbarSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
  snackbarError: {
    id: 'users.UserProfileEdit.UserMainSettings.snackbarError',
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
});

const displayName = 'users.UserProfileEdit.UserMainSettings';

interface FormValues {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
}

interface Props {
  user: AnyUser;
}

const validationSchema = yup.object({
  bio: yup.string().nullable(),
  displayName: yup.string().nullable(),
  location: yup.string().nullable(),
  website: yup.string().url().nullable(),
});

const UserProfileEdit = ({ user }: Props) => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  useEffect(() => {
    if (showSnackbar) {
      const timeout = setTimeout(() => setShowSnackbar(true), 200000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [showSnackbar]);

  const { walletAddress, ethereal } = useLoggedInUser();

  const [editUser, { error }] = useEditUserMutation();
  const onSubmit = useCallback(
    (profile: FormValues) => editUser({ variables: { input: profile } }),
    [editUser],
  );

  return (
    <>
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <Form<FormValues>
        initialValues={{
          displayName: user.profile.displayName || undefined,
          bio: user.profile.bio || undefined,
          website: user.profile.website || undefined,
          location: user.profile.location || undefined,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ status, isSubmitting, dirty, isValid, values }) => (
          <div className={styles.main}>
            <FieldSet>
              <InputLabel label={MSG.labelWallet} />
              <CopyableAddress appearance={{ theme: 'big' }} full>
                {user.profile.walletAddress}
              </CopyableAddress>
            </FieldSet>
            <div className={styles.usernameContainer}>
              <InputLabel label={MSG.labelUsername} />
              <UserMention
                username={user.profile.username || user.profile.walletAddress}
                title={user.profile.username || user.profile.walletAddress}
                hasLink={false}
                data-test="userProfileUsername"
              />
            </div>
            <FieldSet className={styles.inputFieldSet}>
              <Input
                label={MSG.labelName}
                name="displayName"
                dataTest="userSettingsName"
              />
              {values.displayName && isConfusing(values.displayName) && (
                <ConfusableWarning />
              )}
              <Textarea
                label={MSG.labelBio}
                name="bio"
                maxLength={160}
                dataTest="userSettingsBio"
              />
              <Input
                label={MSG.labelWebsite}
                name="website"
                dataTest="userSettingsWebsite"
              />
              <Input
                label={MSG.labelLocation}
                name="location"
                dataTest="userSettingsLocation"
              />
            </FieldSet>
            <FieldSet>
              <Button
                type="submit"
                text={{ id: 'button.save' }}
                loading={isSubmitting}
                dataTest="userSettingsSubmit"
                onClick={() => setShowSnackbar(true)}
                disabled={!dirty || !isValid}
              />
            </FieldSet>
            <FormStatus status={status} />
            <Snackbar
              show={showSnackbar}
              setShow={setShowSnackbar}
              msg={error ? MSG.snackbarError : MSG.snackbarSuccess}
              type={error ? SnackbarType.Error : SnackbarType.Success}
            />
          </div>
        )}
      </Form>
    </>
  );
};

UserMainSettings.displayName = displayName;

export default UserMainSettings;
