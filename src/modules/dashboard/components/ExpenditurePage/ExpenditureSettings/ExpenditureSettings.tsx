import React, { ReactNode, useCallback } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { defineMessages } from 'react-intl';
import { useField } from 'formik';
import {
  InputLabel,
  SelectHorizontal,
  SelectOption,
  FormSection,
} from '~core/Fields';
import { Colony } from '~data/index';
import styles from './ExpenditureSettings.css';
import UserAvatar from '~core/UserAvatar';
import { tokens as tokensData } from './constants';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import UserMention from '~core/UserMention';
import DomainDropdown from '~core/DomainDropdown';
import ColorTag, { Color } from '~core/ColorTag';
import BalanceSelect from './BalanceSelect';

export const MSG = defineMessages({
  typeLabel: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.defaultExpenditureLabel',
    defaultMessage: 'Expenditure type',
  },
  teamLabel: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.defaultTeamLabel',
    defaultMessage: 'Team',
  },
  balanceLabel: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.defaultBalanceLabel',
    defaultMessage: 'Balance',
  },
  ownerLabel: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.defaultOwnerLabel',
    defaultMessage: 'Owner',
  },
  optionAdvanced: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.defaultAdvancedOption',
    defaultMessage: 'Advanced payment',
  },
  split: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.split',
    defaultMessage: 'Split',
  },
});

const expeditureTypes = [
  {
    label: MSG.optionAdvanced,
    value: 'advanced',
  },
  {
    label: MSG.split,
    value: 'split',
  },
];

const displayName = 'dashboard.ExpenditurePage.ExpenditureSettings';

interface Props {
  colony: Colony;
  walletAddress: string;
  username: string;
}

const ExpenditureSettings = ({ colony, walletAddress, username }: Props) => {
  const [, { error }] = useField('filteredDomainId');

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
            label={MSG.typeLabel}
            appearance={{
              theme: 'alt',
              width: 'content',
            }}
            options={expeditureTypes}
            optionSizeLarge
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          <InputLabel
            label={MSG.teamLabel}
            appearance={{
              direction: 'horizontal',
            }}
          />
          {colony && (
            <DomainDropdown
              name="filteredDomainId"
              colony={colony}
              renderActiveOptionFn={renderActiveOption}
              filterOptionsFn={filterDomains}
            />
          )}
        </div>
        {error && <div className={styles.error}>{error}</div>}
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
            label={MSG.ownerLabel}
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
