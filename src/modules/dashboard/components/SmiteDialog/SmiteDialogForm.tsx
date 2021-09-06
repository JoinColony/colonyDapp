import React, { useMemo } from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';
import sortBy from 'lodash/sortBy';

import Button from '~core/Button';
import { ItemDataType } from '~core/OmniPicker';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';

import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { AnyUser } from '~data/index';

import { FormValues } from './SmiteDialog';

import styles from './SmiteDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.title',
    defaultMessage: 'Smite',
  },
  team: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.team',
    defaultMessage: 'Select Team in which punishment should happen',
  },
  who: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.who',
    defaultMessage: 'Pick who is the target',
  },
  amount: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.amount',
    defaultMessage: 'Amount of reputation to deduct',
  },
  annotation: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.annotation',
    defaultMessage: 'Explain why you’re making this payment (optional)',
  },
  userPickerPlaceholder: {
    id: 'SingleUserPicker.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
});
interface Props extends ActionDialogProps {
  subscribedUsers: AnyUser[];
  ethDomainId?: number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const SmiteDialogForm = ({
  back,
  colony: { domains },
  subscribedUsers,
  handleSubmit,
  setFieldValue,
  isSubmitting,
  isValid,
}: Props & FormikProps<FormValues>) => {
  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map(({ name, ethDomainId }) => ({
          value: ethDomainId.toString(),
          label: name,
        })),
        ['value'],
      ),

    [domains],
  );

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={subscribedUsers}
            label={MSG.who}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder={MSG.userPickerPlaceholder}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.team}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.inputContainer}>
          <Input
            name="amount"
            label={MSG.amount}
            appearance={{
              theme: 'minimal',
              align: 'right',
            }}
            formattingOptions={{
              numeral: true,
              prefix: '%',
              // @ts-ignore
              tailPrefix: true,
            }}
            elementOnly
            maxButtonParams={{
              fieldName: 'amount',
              maxAmount: '10',
              setFieldValue,
            }}
          />
          <p className={styles.inputText}>max: 10.1%</p>
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.annotation} name="annotation" />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

SmiteDialogForm.displayName = 'dashboard.SmiteDialog.SmiteDialogForm';

export default SmiteDialogForm;
