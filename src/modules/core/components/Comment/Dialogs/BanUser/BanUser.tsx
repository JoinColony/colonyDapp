import React, { useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import { Form } from '~core/Fields';
import Heading from '~core/Heading';
import { ItemDataType } from '~core/OmniPicker';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import HookedUserAvatar from '~users/HookedUserAvatar';

import {
  useMembersSubscription,
  useBannedUsersQuery,
  AnyUser,
  useBanUserTransactionMessagesMutation,
  useUnBanUserTransactionMessagesMutation,
  BannedUsersDocument,
} from '~data/index';
import { Address } from '~types/index';

import styles from './BanUser.css';
import Button from '~core/Button';

const MSG = defineMessages({
  title: {
    id: 'core.Comment.BanUser.title',
    defaultMessage: `{isBanning, select,
    true {Ban}
    false {Unban}
    } a wallet address from chat`,
  },
  selectUser: {
    id: 'core.Comment.BanUser.selectUser',
    defaultMessage: 'Select user or paste wallet address',
  },
  infoNote: {
    id: 'core.Comment.BanUser.infoNote',
    /* eslint-disable max-len */
    defaultMessage: `Please note: {isBanning, select,
      true {this only prevents this user from chatting in this colony. They will still be able to interact with any smart contracts they have permission to use.}
      other {this only allows this user chatting in this colony. They will still be able to interact with any smart contracts they have permission to use.}
    }`,
    /* eslint-enable max-len */
  },
  banish: {
    id: 'core.Comment.BanUser.banish',
    defaultMessage: 'Banish them',
  },
  deactivateBan: {
    id: 'core.Comment.BanUser.deactivateBan',
    defaultMessage: 'Deactivate ban',
  },
  lastChance: {
    id: `core.Comment.BanUser.lastChance`,
    defaultMessage: 'Let’s give them one last chance...',
  },
  damnedSouls: {
    id: 'core.Comment.BanUser.damnedSouls',
    defaultMessage: 'Leave it on the list of damned souls',
  },
});

export interface FormValues {
  userAddress: Address;
}

const displayName = 'core.Comment.BanUser';

interface Props extends DialogProps {
  colonyAddress: Address;
  isBanning?: boolean;
  addressToBan?: Address;
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

const BanUser = ({
  colonyAddress,
  cancel,
  close,
  isBanning = true,
  addressToBan,
}: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const {
    data: bannedMembers,
    loading: loadingBannedUsers,
  } = useBannedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  const membersBanned = bannedMembers?.bannedUsers || [];

  const membersNotBanned = useMemo(() => {
    const subscribedUsers = colonyMembers?.subscribedUsers || [];
    return subscribedUsers.filter(({ id: currentWalletAddress }) => {
      const isCurrentUserBanned = membersBanned.find(
        ({
          id: bannedUserWalletAddress,
          banned,
        }: {
          id: string;
          banned: boolean;
        }) => currentWalletAddress === bannedUserWalletAddress && banned,
      );
      return !isCurrentUserBanned;
    });
  }, [colonyMembers, membersBanned]);

  const updateMutationHook = isBanning
    ? useBanUserTransactionMessagesMutation
    : useUnBanUserTransactionMessagesMutation;
  const [updateBanStatus, { loading: loadingBanAction }] = updateMutationHook();

  const handleSubmit = useCallback(
    ({ userAddress }: FormValues) => {
      return (updateBanStatus({
        variables: {
          input: {
            colonyAddress,
            userAddress: ((userAddress as unknown) as AnyUser).profile
              .walletAddress,
          },
        },
        refetchQueries: [
          {
            query: BannedUsersDocument,
            variables: { colonyAddress },
          },
        ],
      }) as Promise<boolean>).then(close);
    },
    [close, colonyAddress, updateBanStatus],
  );

  const membersList = useMemo(
    () => (isBanning ? membersNotBanned : membersBanned),
    [isBanning, membersNotBanned, membersBanned],
  );

  const selectedUser = useMemo(
    () =>
      (membersList as AnyUser[]).find(
        (user) => user.profile?.walletAddress === addressToBan,
      ),
    [membersList, addressToBan],
  );

  return (
    <Form
      initialValues={{
        userAddress: addressToBan ? selectedUser : '',
      }}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isValid,
        isSubmitting,
        values,
        submitForm,
      }: FormikProps<FormValues>) => (
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
                data={membersList}
                label={MSG.selectUser}
                name="userAddress"
                filter={filterUserSelection}
                renderAvatar={supRenderAvatar}
                disabled={
                  loadingBannedUsers || loadingBanAction || isSubmitting
                }
              />
            </div>
          </DialogSection>
          <DialogSection>
            <hr className={styles.divider} />
            <div className={styles.infoNote}>
              <FormattedMessage {...MSG.infoNote} values={{ isBanning }} />
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
            <div className={styles.footer}>
              <Button
                appearance={{ theme: 'secondary', size: 'medium' }}
                text={isBanning ? MSG.lastChance : MSG.damnedSouls}
                onClick={close}
              />
              <Button
                type="submit"
                appearance={{
                  theme: isBanning ? 'pink' : 'primary',
                  size: 'large',
                }}
                text={isBanning ? MSG.banish : MSG.deactivateBan}
                disabled={!isValid || isSubmitting || values.userAddress === ''}
                loading={loadingBanAction || isSubmitting}
                onClick={submitForm}
              />
            </div>
          </DialogSection>
        </Dialog>
      )}
    </Form>
  );
};

BanUser.displayName = displayName;

export default BanUser;
