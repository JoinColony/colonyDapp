/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import type { UserType } from '~immutable';

import CopyableAddress from '~components/core/CopyableAddress';
import UserMention from '~components/core/UserMention';
import Heading from '~components/core/Heading';
import {
  FieldSet,
  ActionForm,
  FormStatus,
  Input,
  InputLabel,
  Textarea,
} from '~components/core/Fields';
import Button from '~components/core/Button';
import ProfileTemplate from '~components/pages/ProfileTemplate';
import { ACTIONS } from '~redux';

import { userProfile as userProfileStoreBlueprint } from '../../data/blueprints';

import { currentUser } from '~redux/selectors';

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

type Props = {|
  user: UserType,
|};

const displayName = 'users.UserProfileEdit';

const UserProfileEdit = ({ user }: Props) => (
  <ProfileTemplate
    appearance={{ theme: 'alt' }}
    asideContent={
      <Sidebar
        walletAddress={user.profile.walletAddress}
        username={user.profile.username || user.profile.walletAddress}
      />
    }
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
      validationSchema={userProfileStoreBlueprint.schema}
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

export default compose(
  connect(state => ({
    user: currentUser(state),
  })),
  withImmutablePropsToJS,
)(UserProfileEdit);
