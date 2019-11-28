import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as yup from 'yup';

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
import { useCurrentUser } from '~data/helpers';

import { EDIT_USER } from '../../mutations';
import { USER } from '../../queries';
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
  website: yup
    .string()
    .url()
    .nullable(),
});

const UserProfileEdit = () => {
  const { walletAddress } = useCurrentUser();

  const [editUser] = useMutation(EDIT_USER);
  const onSubmit = useCallback(
    (profile: FormValues) => editUser({ variables: { input: profile } }),
    [editUser],
  );

  const { data } = useQuery(USER, {
    variables: { address: walletAddress },
  });

  if (!data || !data.user) {
    return <UserProfileSpinner />;
  }

  const { user } = data;

  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<Sidebar user={user} />}
    >
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <Form
        initialValues={{
          displayName: user.profile.displayName,
          bio: user.profile.bio,
          website: user.profile.website,
          location: user.profile.location,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ status, isSubmitting }) => (
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
                data-test="userSettingsName"
              />
              <Textarea
                label={MSG.labelBio}
                name="bio"
                maxLength={160}
                data-test="userSettingsBio"
              />
              <Input
                label={MSG.labelWebsite}
                name="website"
                data-test="userSettingsWebsite"
              />
              <Input
                label={MSG.labelLocation}
                name="location"
                data-test="userSettingsLocation"
              />
            </FieldSet>
            <FieldSet>
              <Button
                type="submit"
                text={{ id: 'button.save' }}
                loading={isSubmitting}
                data-test="userSettingsSubmit"
              />
            </FieldSet>
            <FormStatus status={status} />
          </div>
        )}
      </Form>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
