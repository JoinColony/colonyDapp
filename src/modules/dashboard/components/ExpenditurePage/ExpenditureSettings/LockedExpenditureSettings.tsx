import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { InputLabel, FormSection, Form } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import ColorTag, { Color } from '~core/ColorTag';
import { Colony, useLoggedInUser } from '~data/index';

import BalanceSelect from './BalanceSelect';
import { tokens as tokensData } from './constants';
import styles from './ExpenditureSettings.css';

export const MSG = defineMessages({
  type: {
    id: `dashboard.ExpenditurePage.ExpenditureSettings.LockedExpenditureSettings.type`,
    defaultMessage: 'Expenditure type',
  },
  team: {
    id: `dashboard.ExpenditurePage.ExpenditureSettings.LockedExpenditureSettings.team`,
    defaultMessage: 'Team',
  },
  owner: {
    id: `dashboard.ExpenditurePage.ExpenditureSettings.LockedExpenditureSettings.owner`,
    defaultMessage: 'Owner',
  },
});

const displayName =
  'dashboard.ExpenditurePage.ExpenditureSettings.LockedExpenditureSettings';

interface Props {
  expenditure?: string;
  filteredDomainId?: string;
  colony?: Colony;
}

const LockedExpenditureSettings = ({
  expenditure,
  filteredDomainId,
  colony,
}: Props) => {
  const [activeToken, ...tokens] = tokensData;
  const { username, walletAddress } = useLoggedInUser();

  const domain = useMemo(
    () =>
      colony?.domains.find(
        ({ ethDomainId }) => Number(filteredDomainId) === ethDomainId,
      ),
    [colony, filteredDomainId],
  );

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
      return domain ? domain.color : defaultColor;
    },
    [colony, domain],
  );

  return (
    <div className={styles.container}>
      <>
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.expenditureContainer}>
            <InputLabel
              label={MSG.type}
              appearance={{
                direction: 'horizontal',
              }}
            />
            <span className={styles.expenditure}>{expenditure}</span>
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
            <div className={styles.activeItem}>
              <ColorTag color={getDomainColor(filteredDomainId)} />
              <div
                className={classNames(
                  styles.activeItemLabel,
                  styles.lockedActiveItemLabel,
                )}
              >
                {domain?.name}
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection appearance={{ border: 'bottom' }}>
          <Form initialValues={{}} onSubmit={() => {}}>
            <BalanceSelect
              activeToken={activeToken}
              tokens={tokens}
              name="balance"
              isLocked
            />
          </Form>
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
    </div>
  );
};

LockedExpenditureSettings.displayName = displayName;

export default LockedExpenditureSettings;
