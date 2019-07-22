/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { ACTIONS } from '~redux';
import { useSelector } from '~utils/hooks';

import CopyableAddress from '~core/CopyableAddress';
import UserMention from '~core/UserMention';
import Heading from '~core/Heading';
import {
  FieldSet,
  ActionForm,
  FormStatus,
  Input,
  InputLabel,
  Textarea,
} from '~core/Fields';
import Button from '~core/Button';
import ProfileTemplate from '~pages/ProfileTemplate';

import { UpdateUserProfileCommandArgsSchema } from '../../data/schemas';
import { currentUserSelector } from '../../selectors';

import styles from './UserProfileEdit.css';

import Sidebar from './Sidebar.jsx';

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

const UserProfileEdit = () => {
  const user = useSelector(currentUserSelector);
  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<Sidebar user={user} />}
    >
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <ActionForm
        submit={ACTIONS.USER_PROFILE_UPDATE}
        success={ACTIONS.USER_PROFILE_UPDATE_SUCCESS}
        error={ACTIONS.USER_PROFILE_UPDATE_ERROR}
        initialValues={{
          displayName: user.profile.displayName,
          bio: user.profile.bio,
          website: user.profile.website,
          location: user.profile.location,
        }}
        validationSchema={UpdateUserProfileCommandArgsSchema}
      >
        {({ status, isSubmitting }) => (
          <div>
            <FieldSet>
              <InputLabel label={MSG.labelWallet} />
              <CopyableAddress appearance={{ theme: 'big' }} full>
                {user.profile.walletAddress}
              </CopyableAddress>
            </FieldSet>
            <FieldSet>
              <InputLabel label={MSG.labelUsername} />
              <UserMention
                username={user.profile.username || user.profile.walletAddress}
                hasLink={false}
                data-test="userProfileUsername"
              />
            </FieldSet>
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
      </ActionForm>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
