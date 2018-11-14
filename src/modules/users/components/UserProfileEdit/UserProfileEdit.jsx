/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import type { UserRecord } from '~types/index';

import CopyableAddress from '~core/CopyableAddress';
import UserMention from '~core/UserMention';
import Heading from '~core/Heading';
import { FieldSet, Form, Input, InputLabel, Textarea } from '~core/Fields';
import Button from '~core/Button';
import ProfileTemplate from '~pages/ProfileTemplate';

import { currentUser } from '../../selectors';

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
        walletAddress={user.walletAddress}
        username={user.username || user.walletAddress}
        avatarURL={user.avatar}
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
        name: user.displayName,
        bio: user.bio,
        website: user.website,
        location: user.location,
      }}
    >
      {() => (
        <div>
          <FieldSet>
            <InputLabel label={MSG.labelWallet} />
            <CopyableAddress appearance={{ theme: 'big' }} full>
              {user.walletAddress}
            </CopyableAddress>
          </FieldSet>
          <FieldSet>
            <InputLabel label={MSG.labelUsername} />
            <UserMention username={user.username || user.walletAddress} />
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

const mapStateToProps = state => ({
  user: currentUser(state),
});

export default connect(mapStateToProps)(UserProfileEdit);
