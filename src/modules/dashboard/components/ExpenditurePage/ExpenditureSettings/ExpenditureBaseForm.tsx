import React, { ReactNode, useCallback } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { InputLabel, SelectOption, FormSection } from '~core/Fields';
import { Colony, useLoggedInUser } from '~data/index';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import ColorTag, { Color } from '~core/ColorTag';
import DomainDropdown from '~core/DomainDropdown';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import BalanceSelect from './BalanceSelect';
import { tokens as tokensData } from './constants';
import styles from './ExpenditureSettings.css';

export const MSG = defineMessages({
  team: {
    id: 'dashboard.ExpenditurePage.ExpenditureBaseForm.team',
    defaultMessage: 'Team',
  },
  balance: {
    id: 'dashboard.ExpenditurePage.ExpenditureBaseForm.balance',
    defaultMessage: 'Balance',
  },
  owner: {
    id: 'dashboard.ExpenditurePage.ExpenditureBaseForm.owner',
    defaultMessage: 'Owner',
  },
});

const displayName =
  'dashboard.ExpenditurePage.ExpenditureSettings.ExpenditureBaseForm';

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const ExpenditureBaseForm = ({ colony, sidebarRef }: Props) => {
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
    <>
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
    </>
  );
};

ExpenditureBaseForm.displayName = displayName;

export default ExpenditureBaseForm;
