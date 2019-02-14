/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { ColonyType } from '~immutable';

import Heading from '~components/core/Heading';
import CopyableAddress from '~components/core/CopyableAddress';
import {
  FieldSet,
  Input,
  InputLabel,
  Textarea,
  ActionForm,
  FormStatus,
} from '~components/core/Fields';
import Button from '~components/core/Button';
import { getENSDomainString } from '~utils/web3/ens';
import { mergePayload } from '~utils/actions';
import { ACTIONS } from '~redux';

import { colonyStoreBlueprint } from '~redux/stores';

import ColonyAvatarUploader from './ColonyAvatarUploader.jsx';

import styles from './ProfileEdit.css';

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
});

/*
 * This is due to `displayName` already being declared in the Component's scope
 */
const componentDisplayName: string = 'admin.Profile.ProfileEdit';

type Props = {|
  colony: ColonyType,
|};

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
          submit={ACTIONS.COLONY_PROFILE_UPDATE}
          success={ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS}
          error={ACTIONS.COLONY_PROFILE_UPDATE_ERROR}
          setPayload={(action: *, payload: *) =>
            mergePayload(action, { payload, meta: { keyPath: [ensName] } })
          }
          initialValues={{
            ensName,
            name,
            description,
            website,
            guideline,
          }}
          validationSchema={colonyStoreBlueprint.schema}
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
        <ColonyAvatarUploader
          name={name}
          avatar={avatar}
          address={address}
          ensName={ensName}
        />
      </aside>
    </div>
  );
};

ProfileEdit.displayName = componentDisplayName;

export default ProfileEdit;
