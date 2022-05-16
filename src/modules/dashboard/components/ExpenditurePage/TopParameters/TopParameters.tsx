import React, { ReactNode, useCallback, useMemo } from 'react';
import sortBy from 'lodash/sortBy';

import { defineMessages } from 'react-intl';
import { DialogSection } from '~core/Dialog';
import { Form, InputLabel, Select, SelectOption } from '~core/Fields';
import { OneDomain, useLoggedInUser } from '~data/index';

import styles from './TopParameters.css';
import UserAvatar from '~core/UserAvatar';
import TeamDropdownItem from '~dashboard/Dialogs/AwardAndSmiteDialogs/ManageReputationDialogForm/TeamDropdownItem';
import XDAIIcon from '../../../../../img/tokens/xDAI.svg';

import { balanceData, colonyAddress, domains } from './consts';
import { Appearance } from '~core/Fields/Select/types';
import { Appearance as DialogAppearance } from '~core/Dialog/DialogSection';

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

const TopParameters = () => {
  const { walletAddress, username } = useLoggedInUser();

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

  const renderBalanceActiveOption = useCallback(
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

  const appareanceSettings: Appearance = {
    theme: 'alt',
    direction: 'horizontal',
    optionSize: 'large',
    colorSchema: 'lightGrey',
    size: 'small',
  };

  const dialogSectionSettings: DialogAppearance = {
    border: 'bottom',
    size: 'small',
  };

  return (
    <div className={styles.container}>
      <Form initialValues={{}} initialErrors={{}} onSubmit={() => {}}>
        <DialogSection appearance={dialogSectionSettings}>
          <Select
            name="expenditureType"
            label={MSG.defaultExpenditureTypeLabel}
            appearance={{
              ...appareanceSettings,
              width: 'content',
            }}
            options={[{ label: 'Advanced payment', value: 'Advanced' }]}
          />
        </DialogSection>
        <DialogSection appearance={dialogSectionSettings}>
          <Select
            options={domainOptions}
            label={MSG.defaultTeamLabel}
            name="team"
            appearance={{
              ...appareanceSettings,
              padding: 'none',
            }}
            renderActiveOption={renderActiveOption}
          />
        </DialogSection>
        <DialogSection appearance={dialogSectionSettings}>
          <Select
            name="balance"
            label={MSG.defaultBalanceLabel}
            appearance={{
              ...appareanceSettings,
              listPosition: 'static',
              optionSize: 'default',
            }}
            options={balanceData}
            renderActiveOption={renderBalanceActiveOption}
            unselectable
          />
        </DialogSection>
        <DialogSection appearance={dialogSectionSettings}>
          <div className={styles.userContainer}>
            <InputLabel
              label={MSG.defaultOwnerLabel}
              appearance={{
                direction: 'horizontal',
                colorSchema: 'lightGrey',
              }}
            />
            <div className={styles.userAvatarContainer}>
              <UserAvatar address={walletAddress} size="xs" notSet={false} />
              <div className={styles.userName}>@{username}</div>
            </div>
          </div>
        </DialogSection>
      </Form>
    </div>
  );
};

export default TopParameters;
