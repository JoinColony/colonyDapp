/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import CopyableAddress from '~core/CopyableAddress';
import UserMention from '~core/UserMention';
import Heading from '~core/Heading';
import { FieldSet, Form, Input, InputLabel, Textarea } from '~core/Fields';
import Button from '~core/Button';

import styles from './UserProfileEdit.css';

import ProfileTemplate from '~pages/ProfileTemplate';

import Sidebar from './Sidebar.jsx';

import mockUser from '../UserProfile/__datamocks__/mockUser';

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

const displayName = 'users.UserProfileEdit';

const UserProfileEdit = () => (
  <ProfileTemplate
    appearance={{ theme: 'alt' }}
    asideContent={
      <Sidebar
        walletAddress={mockUser.walletAddress}
        username={mockUser.username}
        avatarURL={mockUser.avatar}
      />
    }
  >
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <Form
      onSubmit={values => {
        // eslint-disable-next-line no-console
        console.log(values);
      }}
      initialValues={{
        name: mockUser.displayName,
        bio: mockUser.bio,
        website: mockUser.website,
        location: mockUser.location,
      }}
    >
      {() => (
        <div>
          <FieldSet>
            <InputLabel label={MSG.labelWallet} />
            <CopyableAddress appearance={{ theme: 'big' }} full>
              {mockUser.walletAddress}
            </CopyableAddress>
          </FieldSet>
          <FieldSet>
            <InputLabel label={MSG.labelUsername} />
            <UserMention username={mockUser.username} />
          </FieldSet>
          <FieldSet className={styles.inputFieldSet}>
            <Input label={MSG.labelName} name="name" maxLength={50} />
            <Textarea label={MSG.labelBio} name="bio" maxLength={160} />
            <Input label={MSG.labelWebsite} name="website" maxLength={100} />
            <Input label={MSG.labelLocation} name="location" maxLength={70} />
          </FieldSet>
          <FieldSet>
            <Button type="submit" text={{ id: 'button.save' }} />
          </FieldSet>
        </div>
      )}
    </Form>
  </ProfileTemplate>
);

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
