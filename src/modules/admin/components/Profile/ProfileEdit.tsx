import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import * as yup from 'yup';

import { ColonyType } from '~immutable/index';
import Heading from '~core/Heading';
import CopyableAddress from '~core/CopyableAddress';
import {
  Form,
  FieldSet,
  Input,
  InputLabel,
  Textarea,
  FormStatus,
} from '~core/Fields';
import Button from '~core/Button';
import { useColonyNativeToken } from '../../../dashboard/hooks/useColonyNativeToken';
import ENS from '~lib/ENS';
import ColonyAvatarUploader from './ColonyAvatarUploader';
import { EDIT_COLONY } from '../../../dashboard/mutations';

import styles from './ProfileEdit.css';

const MSG = defineMessages({
  labelAddress: {
    id: 'admin.Profile.ProfileEdit.labelAddress',
    defaultMessage: 'Colony Address',
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
  labelTokenAddress: {
    id: 'admin.Profile.ProfileEdit.labelTokenAddress',
    defaultMessage: 'Token Address',
  },
  labelWebsite: {
    id: 'admin.Profile.ProfileEdit.labelWebsite',
    defaultMessage: 'Website',
  },
  labelGuidelines: {
    id: 'admin.Profile.ProfileEdit.labelGuidelines',
    defaultMessage: 'Contribution Guidelines URL',
  },
  sendTokens: {
    id: 'admin.Profile.ProfileEdit.sendTokens',
    defaultMessage: '(Send tokens to this address to fund your colony)',
  },
  title: {
    id: 'admin.Profile.ProfileEdit.title',
    defaultMessage: 'Colony Profile',
  },
});

/*
 * This is due to `displayName` already being declared in the Component's scope
 */
const componentDisplayName = 'admin.Profile.ProfileEdit';

interface FormValues {
  description?: string;
  displayName?: string;
  guideline?: string;
  website?: string;
}

const validationSchema = yup.object({
  description: yup.string().nullable(),
  displayName: yup.string().nullable(),
  guideline: yup
    .string()
    .url()
    .nullable(),
  website: yup
    .string()
    .url()
    .nullable(),
});

interface Props {
  colony: ColonyType;
}

const ProfileEdit = ({ colony }: Props) => {
  const {
    colonyAddress,
    colonyName,
    description,
    displayName,
    guideline,
    website,
  } = colony;

  const [editColony] = useMutation(EDIT_COLONY);
  const onSubmit = useCallback(
    (profile: FormValues) =>
      editColony({
        variables: {
          input: {
            ...profile,
            colonyAddress,
          },
        },
      }),
    [colonyAddress, editColony],
  );

  const { address: nativeTokenAddress = '' } =
    useColonyNativeToken(colonyAddress) || {};

  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
      </div>
      <div className={styles.mainContentContainer}>
        <main className={styles.content}>
          <Form
            initialValues={{
              description,
              displayName,
              guideline,
              website,
            }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ status, isSubmitting }) => (
              <>
                <FieldSet className={styles.section}>
                  <InputLabel label={MSG.labelAddress} help={MSG.sendTokens} />
                  <CopyableAddress appearance={{ theme: 'big' }} full>
                    {colonyAddress}
                  </CopyableAddress>
                </FieldSet>
                <div className={styles.sectionENSName}>
                  <InputLabel label={MSG.labelEnsName} />
                  <Heading
                    appearance={{
                      margin: 'none',
                      size: 'medium',
                      weight: 'thin',
                    }}
                    /*
                     * For the next improvement, we'll need to strip out
                     * the ENS subdomain part, and just truncate the actual
                     * name, so it'll look something like this:
                     * aaaaaaaaaaaaaaaa... .colony.joincolony.eth
                     */
                    text={ENS.getFullDomain('colony', colonyName)}
                  />
                </div>
                {nativeTokenAddress && (
                  <div className={styles.section}>
                    <InputLabel label={MSG.labelTokenAddress} />
                    <CopyableAddress appearance={{ theme: 'big' }} full>
                      {nativeTokenAddress}
                    </CopyableAddress>
                  </div>
                )}
                <div className={styles.divider} />
                <FieldSet className={styles.inputSection}>
                  <Input
                    appearance={{ theme: 'fat' }}
                    label={MSG.labelDisplayName}
                    name="displayName"
                  />
                </FieldSet>
                <FieldSet className={styles.inputSection}>
                  <Textarea
                    appearance={{ theme: 'fat', resizable: 'vertical' }}
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
                  />
                </FieldSet>
                <FieldSet className={styles.inputSection}>
                  <Input
                    appearance={{ theme: 'fat' }}
                    label={MSG.labelGuidelines}
                    name="guideline"
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
              </>
            )}
          </Form>
        </main>
        <aside className={styles.sidebar}>
          <ColonyAvatarUploader colony={colony} />
        </aside>
      </div>
    </div>
  );
};

ProfileEdit.displayName = componentDisplayName;

export default ProfileEdit;
