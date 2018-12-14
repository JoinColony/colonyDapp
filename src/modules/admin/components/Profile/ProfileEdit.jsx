/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
// import { Formik } from 'formik';

import Heading from '~core/Heading';
import CopyableAddress from '~core/CopyableAddress';
import {
  FieldSet,
  Input,
  InputLabel,
  Textarea,
  ActionForm,
  FormStatus,
} from '~core/Fields';
import Button from '~core/Button';
import AvatarUploader from '~core/AvatarUploader';
import ColonyAvatar from '~core/ColonyAvatar';
import { getENSDomainString } from '~utils/ens';

import {
  COLONY_PROFILE_UPDATE,
  COLONY_PROFILE_UPDATE_ERROR,
  COLONY_PROFILE_UPDATE_SUCCESS,
} from '../../../dashboard/actionTypes';

import styles from './ProfileEdit.css';

import type { ColonyRecord } from '~immutable';

const MSG = defineMessages({
  labelAddress: {
    id: 'admin.Profile.ProfileEdit.labelAddress',
    defaultMessage:
      'Colony address (send tokens to this address to fund your Colony)',
  },
  labelEnsName: {
    id: 'admin.Profile.ProfileEdit.labelEnsName',
    defaultMessage: 'Colony ENS',
  },
  labelDisplayName: {
    id: 'admin.Profile.ProfileEdit.labelDisplayName',
    defaultMessage: 'Colony Display Name',
  },
  labelAbout: {
    id: 'admin.Profile.ProfileEdit.labelAbout',
    defaultMessage: 'About',
  },
  labelWebsite: {
    id: 'admin.Profile.ProfileEdit.labelWebsite',
    defaultMessage: 'Website',
  },
  labelGuidelines: {
    id: 'admin.Profile.ProfileEdit.labelGuidelines',
    defaultMessage: 'Contribution Guidelines',
  },
  labelProfilePicture: {
    id: 'admin.Profile.ProfileEdit.labelProfilePicture',
    defaultMessage: 'Colony Profile Picture',
  },
  labelUploader: {
    id: 'admin.Profile.ProfileEdit.labelUploader',
    defaultMessage: 'at least 250px by 250px, up to 1MB',
  },
});

/*
 * This is due to `displayName` already being declared in the Component's scope
 */
const componentDisplayName: string = 'admin.Profile.ProfileEdit';

/*
 * @TODO Replace with ACTUAL upload & remove methods
 */
const placeholderUpload = async () =>
  `[${componentDisplayName}] Uploaded Image`;

const placeholderRemove = async () => {
  // Implement me
};

type Props = {
  colony: ColonyRecord,
};

const ProfileEdit = ({ colony }: Props) => {
  const {
    avatar,
    description,
    guideline,
    address,
    ensName,
    name,
    website,
  } = colony;
  return (
    <div className={styles.main}>
      <main className={styles.content}>
        <ActionForm
          submit={COLONY_PROFILE_UPDATE}
          success={COLONY_PROFILE_UPDATE_SUCCESS}
          error={COLONY_PROFILE_UPDATE_ERROR}
          initialValues={{
            ensName,
            name,
            description,
            website,
            guideline,
          }}
          /*
           * @TODO Add form validation
           * If this makes to the review, raise hell!
           */
          // validationSchema={userProfileStore.schema}
        >
          {({ status, isSubmitting }) => (
            <Fragment>
              <FieldSet className={styles.section}>
                <InputLabel label={MSG.labelAddress} />
                <CopyableAddress appearance={{ theme: 'big' }} full>
                  {address}
                </CopyableAddress>
              </FieldSet>
              <FieldSet className={styles.section}>
                <InputLabel label={MSG.labelEnsName} />
                <Heading
                  appearance={{
                    margin: 'none',
                    size: 'medium',
                    weight: 'thin',
                  }}
                  text={getENSDomainString(ensName, 'colony')}
                />
              </FieldSet>
              <div className={styles.divider} />
              <FieldSet className={styles.inputSection}>
                <Input
                  appearance={{ theme: 'fat' }}
                  label={MSG.labelDisplayName}
                  name="name"
                  maxLength={50}
                />
              </FieldSet>
              <FieldSet className={styles.inputSection}>
                <Textarea
                  appearance={{ theme: 'fat', resizable: 'vertical' }}
                  style={{ minHeight: styles.textareaHeight }}
                  label={MSG.labelAbout}
                  name="description"
                  maxLength={160}
                />
              </FieldSet>
              <FieldSet className={styles.inputSection}>
                <Input
                  appearance={{ theme: 'fat' }}
                  label={MSG.labelWebsite}
                  name="website"
                  maxLength={100}
                />
              </FieldSet>
              <FieldSet className={styles.inputSection}>
                <Input
                  appearance={{ theme: 'fat' }}
                  label={MSG.labelGuidelines}
                  name="guideline"
                  maxLength={100}
                />
              </FieldSet>
              <FieldSet>
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  style={{ width: styles.wideButton }}
                  text={{ id: 'button.save' }}
                  type="submit"
                  loading={isSubmitting}
                />
              </FieldSet>
              <FormStatus status={status} />
            </Fragment>
          )}
        </ActionForm>
      </main>
      <aside className={styles.sidebar}>
        <AvatarUploader
          label={MSG.labelProfilePicture}
          help={MSG.labelUploader}
          placeholder={
            <ColonyAvatar
              address={address}
              avatar={avatar}
              name={name}
              /*
               * @NOTE Unlike other components this does not override the main class
               * But appends the current one to that
               */
              className={styles.avatar}
              size="xl"
            />
          }
          upload={placeholderUpload}
          remove={placeholderRemove}
        />
      </aside>
    </div>
  );
};

ProfileEdit.displayName = componentDisplayName;

export default ProfileEdit;
