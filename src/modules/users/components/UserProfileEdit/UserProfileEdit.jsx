/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import type { UserRecord } from '~types';

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

import { userProfileStore } from '../../stores';

import { currentUser } from '../../selectors';

import {
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
} from '../../actionTypes';

import styles from './UserProfileEdit.css';

import Sidebar from './Sidebar.jsx';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.heading',
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: 'users.UserProfileEdit.labelWallet',
    defaultMessage: 'Your wallet',
  },
  labelUsername: {
    id: 'users.UserProfileEdit.labelUsername',
    defaultMessage: 'Unique username',
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

type Props = {
  user: UserRecord,
};

const displayName = 'users.UserProfileEdit';

const UserProfileEdit = ({ user }: Props) => (
  <ProfileTemplate
    appearance={{ theme: 'alt' }}
    asideContent={
      <Sidebar
        walletAddress={user.profile.walletAddress}
        username={user.profile.username || user.profile.walletAddress}
        avatarURL={user.profile.avatar}
      />
    }
  >
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <ActionForm
      submit={USER_PROFILE_UPDATE}
      success={USER_PROFILE_UPDATE_SUCCESS}
      error={USER_PROFILE_UPDATE_ERROR}
      initialValues={{
        displayName: user.profile.displayName,
        bio: user.profile.bio,
        website: user.profile.website,
        location: user.profile.location,
      }}
      validationSchema={userProfileStore.schema}
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
            />
          </FieldSet>
          <FieldSet className={styles.inputFieldSet}>
            <Input label={MSG.labelName} name="displayName" />
            <Textarea label={MSG.labelBio} name="bio" maxLength={160} />
            <Input label={MSG.labelWebsite} name="website" />
            <Input label={MSG.labelLocation} name="location" />
          </FieldSet>
          <FieldSet>
            <Button
              type="submit"
              text={{ id: 'button.save' }}
              loading={isSubmitting}
            />
          </FieldSet>
          <FormStatus status={status} />
        </div>
      )}
    </ActionForm>
  </ProfileTemplate>
);

UserProfileEdit.displayName = displayName;

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(UserProfileEdit);
