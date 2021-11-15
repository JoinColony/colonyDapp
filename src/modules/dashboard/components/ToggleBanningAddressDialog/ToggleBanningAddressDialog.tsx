import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import { Form } from '~core/Fields';
import Heading from '~core/Heading';
import { ItemDataType } from '~core/OmniPicker';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { useMembersSubscription, AnyUser } from '~data/index';
import { Address } from '~types/index';

import styles from './ToggleBanningAddressDialog.css';
import Button from '~core/Button';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ToggleBanningAddressDialog.title',
    defaultMessage: `{isBanning, select,
    true {Ban}
    false {Unban}
    } a wallet address from chat`,
  },
  selectUser: {
    id: 'dashboard.ToggleBanningAddressDialog.selectUser',
    defaultMessage: 'Select user or paste wallet address',
  },
  infoNote: {
    id: 'dashboard.ToggleBanningAddressDialog.infoNote',
    defaultMessage: `Please note: this only prevents the user from chatting in this colony. They will still be able to interact with any smart contracts they have permission to use.`,
  },
  banish: {
    id: 'dashboard.ToggleBanningAddressDialog.banish',
    defaultMessage: 'Banish them',
  },
  deactivateBan: {
    id: 'dashboard.ToggleBanningAddressDialog.deactivateBan',
    defaultMessage: 'Deactivate ban',
  },
  lastChance: {
    id: `dashboard.ToggleBanningAddressDialog.lastChance`,
    defaultMessage: 'Let’s give them one last chance...',
  },
  damnedSouls: {
    id: 'dashboard.ToggleBanningAddressDialog.damnedSouls',
    defaultMessage: 'Leave it on the list of damned souls',
  },
});

export interface FormValues {
  userAddress: Address;
}

const displayName = 'dashboard.ToggleBanningAddressDialog';

interface Props extends DialogProps {
  colonyAddress: Address;
  isBanning?: boolean;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const validationSchema = yup.object().shape({
  userAddress: yup.object().shape({
    profile: yup.object().shape({
      walletAddress: yup.string().address().required(),
    }),
  }),
});

const ToggleBanningAddressDialog = ({
  colonyAddress,
  cancel,
  close,
  isBanning = true,
}: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  return (
    <Form
      initialValues={{ userAddress: '' }}
      validationSchema={validationSchema}
      validateOnMount
      /* temporary to avoid ts error */
      onSubmit={close}
    >
      {({ isValid }: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogSection>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
              textValues={{ isBanning }}
            />
          </DialogSection>
          <DialogSection>
            <div className={styles.userPickerContainer}>
              <SingleUserPicker
                appearance={{ width: 'wide' }}
                data={colonyMembers?.subscribedUsers || []}
                label={MSG.selectUser}
                name="userAddress"
                filter={filterUserSelection}
                renderAvatar={supRenderAvatar}
              />
            </div>
          </DialogSection>
          <DialogSection>
            <hr className={styles.divider} />
            <div className={styles.infoNote}>
              <FormattedMessage {...MSG.infoNote} />
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
            <div className={styles.footer}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={isBanning ? MSG.lastChance : MSG.damnedSouls}
                onClick={close}
              />
              <Button
                appearance={{
                  theme: isBanning ? 'pink' : 'primary',
                  size: 'large',
                }}
                text={isBanning ? MSG.banish : MSG.deactivateBan}
                disabled={!isValid}
              />
            </div>
          </DialogSection>
        </Dialog>
      )}
    </Form>
  );
};

ToggleBanningAddressDialog.displayName = displayName;

export default ToggleBanningAddressDialog;
