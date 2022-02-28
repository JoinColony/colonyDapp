import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
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
import ProfileTemplate from '~pages/ProfileTemplate';
import { useLoggedInUser, useUser, useEditUserMutation } from '~data/index';
import { LANDING_PAGE_ROUTE } from '~routes/index';
import { Tabs, Tab, TabList, TabPanel } from '~core/Tabs';
import Toggle from '~core/Fields/Toggle';

import UserProfileSpinner from '../UserProfile/UserProfileSpinner';
import Sidebar from './Sidebar';
import styles from './UserProfileEdit.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.heading',
    defaultMessage: 'Profile',
  },
  headingSettings: {
    id: 'users.UserProfileEdit.headingSettings',
    defaultMessage: 'Settings',
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
  labelCustomRPC: {
    id: 'users.UserProfileEdit.labelCustomRPC',
    defaultMessage: 'Custom RPC',
  },
  lableEnableDecentralized: {
    id: 'users.UserProfileEdit.lableEnableDecentralized',
    defaultMessage: 'Enable Use of Custom RPC (Decentralized Mode)',
  },
  settingsSaveWarning: {
    id: 'users.UserProfileEdit.settingsSaveWarning',
    defaultMessage: `Changing the settings from the centralized to decentralized mode will reload your app!`,
  },
  lableEnableComments: {
    id: 'users.UserProfileEdit.lableEnableComments',
    defaultMessage: 'Enable Comments',
  },
  commentsSaveWarning: {
    id: 'users.UserProfileEdit.commentsSaveWarning',
    defaultMessage: `Changing the comments settings will reload your app!`,
  },
});

const displayName = 'users.UserProfileEdit';

interface FormValues {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
  commentsEnabled?: boolean;
}

interface SettingsFormValues {
  enabled?: boolean;
  customRPC?: string;
}

const validationSchema = yup.object({
  bio: yup.string().nullable(),
  displayName: yup.string().nullable(),
  location: yup.string().nullable(),
  website: yup.string().url().nullable(),
});

const STORAGE_KEY = 'dsettings';

const UserProfileEdit = () => {
  const {
    walletAddress,
    ethereal,
    decentralized,
    username,
    customRPC,
    commentsEnabled,
  } = useLoggedInUser();

  const [editUser] = useEditUserMutation();
  const onProfileSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ commentsEnabled: commentsEnabledValue, ...profile }: FormValues) => {
      editUser({ variables: { input: profile } });
    },
    [editUser],
  );

  const onCommentsUpdate = useCallback((value, setSubmitting) => {
    const currentSettings = localStorage.getItem(STORAGE_KEY);
    const settings = currentSettings ? JSON.parse(currentSettings) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...settings,
        commentsEnabled: !value,
      }),
    );
    setTimeout(() => setSubmitting(false), 200);
    window.location.reload();
  }, []);

  const onSettingsSubmit = useCallback(
    (values: SettingsFormValues, { setSubmitting }) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setTimeout(() => setSubmitting(false), 200);
      if (decentralized !== values.enabled) {
        window.location.reload();
      }
    },
    [decentralized],
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
      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanel>
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
                commentsEnabled:
                  typeof commentsEnabled === 'boolean' ? commentsEnabled : true,
              }}
              onSubmit={onProfileSubmit}
              validationSchema={validationSchema}
            >
              {({ status, isSubmitting, setSubmitting }) => (
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
                      username={user.profile.username || (username as string)}
                      title={user.profile.username || (username as string)}
                      hasLink={false}
                      data-test="userProfileUsername"
                    />
                  </div>
                  {!decentralized && (
                    <>
                      <FieldSet className={styles.inputFieldSet}>
                        <div className={styles.toggle}>
                          <Toggle
                            label={MSG.lableEnableComments}
                            name="commentsEnabled"
                            onChange={(value) =>
                              onCommentsUpdate(value, setSubmitting)
                            }
                          />
                          <p>
                            <FormattedMessage {...MSG.commentsSaveWarning} />
                          </p>
                        </div>
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
                    </>
                  )}
                </div>
              )}
            </Form>
          </>
        </TabPanel>
        <TabPanel>
          <>
            <Heading
              appearance={{ theme: 'dark', size: 'medium' }}
              text={MSG.headingSettings}
            />
            <Form<SettingsFormValues>
              initialValues={{
                enabled: decentralized || false,
                customRPC: customRPC || process.env.RPC_URL,
              }}
              onSubmit={onSettingsSubmit}
              validationSchema={validationSchema}
            >
              {({ status, isSubmitting }) => (
                <div className={styles.main}>
                  <FieldSet className={styles.inputFieldSet}>
                    <div className={styles.toggle}>
                      <Toggle
                        label={MSG.lableEnableDecentralized}
                        name="enabled"
                      />
                    </div>
                    <Input label={MSG.labelCustomRPC} name="customRPC" />
                    <p>
                      <FormattedMessage {...MSG.settingsSaveWarning} />
                    </p>
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
        </TabPanel>
      </Tabs>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
