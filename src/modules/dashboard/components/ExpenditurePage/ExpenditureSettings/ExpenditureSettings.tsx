import React, { ReactNode, useCallback } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import {
  InputLabel,
  SelectHorizontal,
  SelectOption,
  FormSection,
} from '~core/Fields';
import { Colony, useLoggedInUser } from '~data/index';
import UserAvatar from '~core/UserAvatar';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import UserMention from '~core/UserMention';
import ColorTag, { Color } from '~core/ColorTag';
import DomainDropdown from '~core/DomainDropdown';
import { ExpenditureTypes } from '~pages/ExpenditurePage/types';

import BalanceSelect from './BalanceSelect';
import { tokens as tokensData } from './constants';
import styles from './ExpenditureSettings.css';

export const MSG = defineMessages({
  type: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.type',
    defaultMessage: 'Payment type',
  },
  team: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.team',
    defaultMessage: 'Team',
  },
  balance: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.balance',
    defaultMessage: 'Balance',
  },
  owner: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.owner',
    defaultMessage: 'Owner',
  },
  advancedPayment: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.advancedPayment',
    defaultMessage: 'Advanced payment',
  },
  staged: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.staged',
    defaultMessage: 'Staged',
  },
  split: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.split',
    defaultMessage: 'Split',
  },
  batch: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.batch',
    defaultMessage: 'Batch',
  },
});

const expeditureTypes = [
  {
    label: MSG.advancedPayment,
    value: ExpenditureTypes.Advanced,
  },
  {
    label: MSG.split,
    value: ExpenditureTypes.Split,
  },
  {
    label: MSG.staged,
    value: ExpenditureTypes.Staged,
  },
  {
    label: MSG.batch,
    value: ExpenditureTypes.Batch,
  },
];

const displayName = 'dashboard.ExpenditurePage.ExpenditureSettings';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const ExpenditureSettings = ({ colony, sidebarRef }: Props) => {
  const { walletAddress, username } = useLoggedInUser();

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      const domain = colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      return domain ? domain.color : defaultColor;
    },
    [colony],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const value = option?.value;
      const color = getDomainColor(value);

      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} />
          <div className={styles.activeItemLabel}>{label}</div>
        </div>
      );
    },
    [getDomainColor],
  );

  const filterDomains = useCallback((optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);
    if (optionDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
      return false;
    }
    return true;
  }, []);

  const [activeToken, ...tokens] = tokensData;

  return (
    <div className={styles.container}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.blue}>
          <SelectHorizontal
            name="expenditure"
            label={MSG.type}
            appearance={{
              theme: 'alt',
              width: 'content',
            }}
            options={expeditureTypes}
            scrollContainer={sidebarRef}
            placement="bottom"
            withDropdownElelment
            optionSizeLarge
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          <InputLabel
            label={MSG.team}
            appearance={{
              direction: 'horizontal',
            }}
          />
          {colony && (
            <DomainDropdown
              colony={colony}
              name="filteredDomainId"
              renderActiveOptionFn={renderActiveOption}
              filterOptionsFn={filterDomains}
              scrollContainer={sidebarRef}
              placement="bottom"
              withDropdownElelment
            />
          )}
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <BalanceSelect
          activeToken={activeToken}
          tokens={tokens}
          name="balance"
        />
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.userContainer}>
          <InputLabel
            label={MSG.owner}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <div className={styles.userAvatarContainer}>
            <UserAvatar address={walletAddress} size="xs" notSet={false} />
            <div className={styles.userName}>
              <UserMention username={username || ''} />
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
};

ExpenditureSettings.displayName = displayName;

export default ExpenditureSettings;
