import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { Redirect } from 'react-router-dom';

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
import { useEditUserMutation, AnyUser } from '~data/index';
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

const UserMainSettings = ({ user }: Props) => {

  const [editUser] = useEditUserMutation();
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
    </>
  );
};

UserMainSettings.displayName = displayName;

export default UserMainSettings;
