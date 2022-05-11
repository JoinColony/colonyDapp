import React, { useMemo } from 'react';
import sortBy from 'lodash/sortBy';

import { DialogSection } from '~core/Dialog';
import { Form, Select } from '~core/Fields';
import { filterUserSelection } from '~core/SingleUserPicker';
import { AnyUser, OneDomain } from '~data/index';

import styles from './CreatorData.css';
import { Address } from '~types/index';
import { ItemDataType } from '~core/OmniPicker';
import UserAvatar from '~core/UserAvatar';
import TeamDropdownItem from '~dashboard/Dialogs/AwardAndSmiteDialogs/ManageReputationDialogForm/TeamDropdownItem';

import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { balanceData, colonyAddress, domains, userData } from './consts';

interface Props {
  colonyName: string;
}

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const CreatorData = () => {
  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map((domain) => ({
          children: (
            <TeamDropdownItem
              domain={domain as OneDomain}
              colonyAddress={colonyAddress}
              withoutPadding
              // user={(values.user as any) as AnyUser}
            />
          ),
          value: domain.ethDomainId.toString(),
          label: domain.name,
        })),
        ['value'],
      ),
    [],
  );

  return (
    <div className={styles.container}>
      <Form
        initialValues={{ input: '' }}
        initialErrors={{}}
        onSubmit={() => {}}
      >
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
          <Select
            name="input"
            placeholder="I'm wrong as well!"
            label="Expenditure type"
            appearance={{
              theme: 'alt',
              alignOptions: 'left',
              direction: 'horizontal',
              optionSize: 'large',
              colorSchema: 'lightGrey',
              size: 'medium',
            }}
            options={[
              { label: 'Recurring', value: 'recurring' },
              { label: 'Task', value: 'task' },
              { label: 'Advanced', value: 'advanced' },
            ]}
          />
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
          <Select
            options={domainOptions}
            label="Team"
            name="domainId"
            appearance={{
              theme: 'alt',
              alignOptions: 'left',
              direction: 'horizontal',
              optionSize: 'large',
              colorSchema: 'lightGrey',
            }}
          />
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
          <Select
            name="input"
            label="Balance"
            appearance={{
              theme: 'alt',
              alignOptions: 'right',
              direction: 'horizontal',
              listPosition: 'static',
              colorSchema: 'lightGrey',
            }}
            options={balanceData}
            unselectable
          />
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
          <div className={styles.singleUserContainer}>
            <UserPickerWithSearch
              appearance={{ direction: 'horizontal' }}
              data={userData}
              label="Owner"
              name="owner"
              filter={filterUserSelection}
              renderAvatar={supRenderAvatar}
              dataTest="paymentRecipientPicker"
              itemDataTest="paymentRecipientItem"
              placeholder="Search"
            />
          </div>
        </DialogSection>
      </Form>
    </div>
  );
};

export default CreatorData;
