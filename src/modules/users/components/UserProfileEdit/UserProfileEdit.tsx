import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { Redirect } from 'react-router-dom';

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
import ProfileTemplate from '~pages/ProfileTemplate';
import { useLoggedInUser, useUser, useEditUserMutation } from '~data/index';
import { LANDING_PAGE_ROUTE } from '~routes/index';

import UserProfileSpinner from '../UserProfile/UserProfileSpinner';
import Sidebar from './Sidebar';
import styles from './UserProfileEdit.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.heading',
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: 'users.UserProfileEdit.labelWallet',
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: 'users.UserProfileEdit.labelUsername',
    defaultMessage: 'Unique Username',
  },
  labelName: {
    id: 'users.UserProfileEdit.labelName',
    defaultMessage: 'Name',
  },
  labelBio: {
    id: 'users.UserProfileEdit.labelBio',
    defaultMessage: 'Bio',
  },
  labelWebsite: {
    id: 'users.UserProfileEdit.labelWebsite',
    defaultMessage: 'Website',
  },
  labelLocation: {
    id: 'users.UserProfileEdit.labelLocation',
    defaultMessage: 'Location',
  },
  toastSuccess: {
    id: 'users.UserProfileEdit.toastSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
  toastError: {
    id: 'users.UserProfileEdit.toastError',
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
});

const displayName = 'users.UserProfileEdit';

interface FormValues {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
}

const validationSchema = yup.object({
  bio: yup.string().nullable(),
  displayName: yup.string().nullable(),
  location: yup.string().nullable(),
  website: yup.string().url().nullable(),
});

const UserProfileEdit = () => {
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

  const [editUser] = useEditUserMutation();
  const onSubmit = useCallback(
    (profile: FormValues) => editUser({ variables: { input: profile } }),
    [editUser],
  );

  const user = useUser(walletAddress);

  if (!user) {
    return <UserProfileSpinner />;
  }

  if (ethereal) {
    return <Redirect to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<Sidebar user={user} />}
    >
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
        {({ status, isSubmitting, error }) => (
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
              />
            </FieldSet>
            <FormStatus status={status} />
            <Snackbar
              show={showSnackbar}
              setShow={setShowSnackbar}
              msg={error ? MSG.toastError : MSG.toastSuccess}
              type={error ? SnackbarType.Error : SnackbarType.Success}
            />
          </div>
        )}
      </Form>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
