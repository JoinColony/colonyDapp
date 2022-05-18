import React, { ReactNode, useCallback, useMemo } from 'react';
import sortBy from 'lodash/sortBy';

import { defineMessages } from 'react-intl';
import { DialogSection } from '~core/Dialog';
import { Select, SelectOption } from '~core/Fields';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { AnyUser, OneDomain } from '~data/index';

import styles from './TopParameters.css';
import { Address } from '~types/index';
import { ItemDataType } from '~core/OmniPicker';
import UserAvatar from '~core/UserAvatar';
import TeamDropdownItem from '~dashboard/Dialogs/AwardAndSmiteDialogs/ManageReputationDialogForm/TeamDropdownItem';
import XDAIIcon from '../../../../../img/tokens/xDAI.svg';

import { balanceData, colonyAddress, domains, userData } from './consts';

const MSG = defineMessages({
  defaultExpenditureTypeLabel: {
    id: 'TopParameters.defaultExpenditureTypeLabel',
    defaultMessage: 'Expenditure type',
  },
  defaultTeamLabel: {
    id: 'TopParameters.defaultTeamLabel',
    defaultMessage: 'Team',
  },
  defaultBalanceLabel: {
    id: 'TopParameters.defaultBalanceLabel',
    defaultMessage: 'Balance',
  },
  defaultOwnerLabel: {
    id: 'TopParameters.defaultOwnerLabel',
    defaultMessage: 'Owner',
  },
});

interface Props {
  colonyName: string;
}

export const supRenderAvatar = (
  address: Address,
  item: ItemDataType<AnyUser>,
) => <UserAvatar address={address} user={item} size="xs" notSet={false} />;

const TopParameters = () => {
  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map((domain) => ({
          children: (
            <TeamDropdownItem
              domain={domain as OneDomain}
              colonyAddress={colonyAddress}
            />
          ),
          value: domain.ethDomainId.toString(),
          label: domain.name,
        })),
        ['value'],
      ),
    [],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined) => ReactNode
  >((option) => {
    const value = option ? option.value : undefined;
    const domain = domains.find(
      ({ ethDomainId }) => Number(value) === ethDomainId,
    ) as OneDomain;
    return (
      <div className={styles.teamLabel}>
        <TeamDropdownItem
          domain={domain}
          colonyAddress={colonyAddress}
          appearance={{ theme: 'grey' }}
          withoutPadding
        />
      </div>
    );
  }, []);

  const renderBalanceActiveOption = useCallback<
    (option: SelectOption | undefined) => ReactNode
  >(
    () => (
      <div className={styles.label}>
        <span className={styles.icon}>
          <XDAIIcon />
        </span>
        <span>125,000 xDAI</span>
      </div>
    ),
    [],
  );

  return (
    <div className={styles.container}>
      <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
        <Select
          name="expenditureType"
          label={MSG.defaultExpenditureTypeLabel}
          appearance={{
            theme: 'alt',
            alignOptions: 'left',
            direction: 'horizontal',
            optionSize: 'large',
            colorSchema: 'lightGrey',
            size: 'small',
            width: 'content',
          }}
          options={[{ label: 'Advanced', value: 'advanced' }]}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
        <Select
          options={domainOptions}
          label={MSG.defaultTeamLabel}
          name="team"
          appearance={{
            theme: 'alt',
            alignOptions: 'left',
            direction: 'horizontal',
            optionSize: 'large',
            colorSchema: 'lightGrey',
            size: 'small',
            padding: 'none',
          }}
          renderActiveOption={renderActiveOption}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
        <Select
          name="balance"
          label={MSG.defaultBalanceLabel}
          appearance={{
            theme: 'alt',
            alignOptions: 'right',
            direction: 'horizontal',
            listPosition: 'static',
            colorSchema: 'lightGrey',
            size: 'small',
          }}
          options={balanceData}
          renderActiveOption={renderBalanceActiveOption}
          unselectable
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            data={userData}
            label={MSG.defaultOwnerLabel}
            name="owner"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
            placeholder="Search"
            appearance={{
              direction: 'horizontal',
              size: 'small',
              colorSchema: 'lightGrey',
            }}
            hasSearch
          />
        </div>
      </DialogSection>
    </div>
  );
};

export default TopParameters;
