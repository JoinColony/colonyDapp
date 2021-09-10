import React, { useMemo, useCallback, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { AddressZero } from 'ethers/constants';

import Button from '~core/Button';
import { ItemDataType } from '~core/OmniPicker';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations, SelectOption } from '~core/Fields';
import Heading from '~core/Heading';
import { calculatePercentageReputation } from '~core/MemberReputation';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';

import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  AnyUser,
  OneDomain,
  useUserReputationQuery,
  useLoggedInUser,
} from '~data/index';

import { FormValues } from './SmiteDialog';
import TeamDropdownItem from './TeamDropdownItem';

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
    defaultMessage: 'Explain why you are smiting the user (optional)',
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

const DECIMAL_PLACES = 2;

const SmiteDialogForm = ({
  back,
  colony: { domains, colonyAddress },
  colony,
  subscribedUsers,
  handleSubmit,
  setFieldValue,
  isSubmitting,
  isValid,
  values,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress } = useLoggedInUser();

  const { data: userReputationData } = useUserReputationQuery({
    variables: {
      address: walletAddress,
      colonyAddress,
      domainId: Number(values.domainId),
    },
    fetchPolicy: 'network-only',
  });

  const { data: totalReputation } = useUserReputationQuery({
    variables: {
      address: AddressZero,
      colonyAddress,
      domainId: Number(values.domainId),
    },
    fetchPolicy: 'network-only',
  });

  const userPercentageReputation = calculatePercentageReputation(
    DECIMAL_PLACES,
    userReputationData,
    totalReputation,
  );

  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map((domain) => ({
          children: (
            <TeamDropdownItem
              domain={domain as OneDomain}
              colonyAddress={colonyAddress}
              user={(values.user as any) as AnyUser}
            />
          ),
          value: domain.ethDomainId.toString(),
          label: domain.name,
        })),
        ['value'],
      ),

    [domains, values, colonyAddress],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined) => ReactNode
  >(
    (option) => {
      const value = option ? option.value : undefined;
      const domain = colony.domains.find(
        ({ ethDomainId }) => Number(value) === ethDomainId,
      ) as OneDomain;
      return (
        <div className={styles.activeItem}>
          <TeamDropdownItem
            domain={domain}
            colonyAddress={colonyAddress}
            user={(values.user as any) as AnyUser}
          />
        </div>
      );
    },
    [values, colonyAddress, colony.domains],
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
              renderActiveOption={renderActiveOption}
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
              maxAmount: userPercentageReputation?.toString() || '0',
              setFieldValue,
            }}
          />
          <p
            className={styles.inputText}
          >{`max: ${userPercentageReputation}%`}</p>
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
