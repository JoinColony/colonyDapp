import React, { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { DialogSection } from '~core/Dialog';
import { Form, Select } from '~core/Fields';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { AnyUser, OneDomain } from '~data/index';
import {
  useColonyFromNameQuery,
  useMembersSubscription,
} from '~data/generated';

import styles from './CreatorData.css';
import { Address } from '~types/index';
import { ItemDataType } from '~core/OmniPicker';
import UserAvatar from '~core/UserAvatar';
import TeamDropdownItem from '~dashboard/Dialogs/AwardAndSmiteDialogs/ManageReputationDialogForm/TeamDropdownItem';
import CLNYIcon from '../../../../../img/tokens/CLNY.svg';
import EtherIcon from '../../../../../img/tokens/ether.svg';
import XDAIIcon from '../../../../../img/tokens/xDAI.svg';

interface Props {
  colonyName: string;
}

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const CreatorData = ({ colonyName }: Props) => {
  const { data } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
    pollInterval: 5000,
  });

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: '' },
  });

  const domainOptions = useMemo(() => {
    if (!data || !data.processedColony) {
      return [];
    }
    const {
      processedColony: { domains },
      colonyAddress,
    } = data;

    return sortBy(
      domains.map((domain) => ({
        children: (
          <TeamDropdownItem
            domain={domain as OneDomain}
            colonyAddress={colonyAddress}
            // user={(values.user as any) as AnyUser}
          />
        ),
        value: domain.ethDomainId.toString(),
        label: domain.name,
      })),
      ['value'],
    );
  }, [data]);

  return (
    <Form initialValues={{ input: '' }} initialErrors={{}} onSubmit={() => {}}>
      <DialogSection appearance={{ border: 'bottom' }}>
        <Select
          name="input"
          placeholder="I'm wrong as well!"
          label="Expenditure type"
          appearance={{
            theme: 'alt',
            alignOptions: 'left',
            direction: 'horizontal',
            optionSize: 'large',
          }}
          options={[
            { label: 'Advanced payment', value: 'advanced' },
            { label: 'Recurring payment', value: 'recurring' },
            { label: 'Task', value: 'task' },
          ]}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom' }}>
        <Select
          options={domainOptions}
          label="Team"
          name="domainId"
          appearance={{
            theme: 'alt',
            alignOptions: 'left',
            direction: 'horizontal',
            optionSize: 'large',
          }}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom' }}>
        <Select
          name="input"
          label="Balance"
          appearance={{
            theme: 'alt',
            alignOptions: 'right',
            direction: 'horizontal',
            listPosition: 'static',
          }}
          options={[
            {
              label: '25,000 CLNY',
              value: '25,000 CLNY',
              children: (
                <div className={styles.label}>
                  <span className={styles.icon}>
                    <CLNYIcon />
                  </span>
                  <span>25,000 CLNY</span>
                </div>
              ),
            },
            {
              label: '15,000 ETH',
              value: '15,000 ETH',
              children: (
                <div className={styles.label}>
                  <span className={styles.icon}>
                    <EtherIcon />
                  </span>
                  <span>15,000 ETH</span>
                </div>
              ),
            },
            {
              label: '125,000 xDAI',
              value: '125,000 xDAI',
              children: (
                <div className={styles.label}>
                  <span className={styles.icon}>
                    <XDAIIcon />
                  </span>
                  <span>125,000 xDAI</span>
                </div>
              ),
            },
          ]}
          unselectable
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'bottom' }}>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ direction: 'horizontal' }}
            data={colonyMembers?.subscribedUsers || []}
            label="Owner"
            name="recipient"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
          />
        </div>
      </DialogSection>
    </Form>
  );
};

export default CreatorData;
