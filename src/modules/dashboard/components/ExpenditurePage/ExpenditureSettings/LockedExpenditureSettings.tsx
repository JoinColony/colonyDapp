import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { defineMessages } from 'react-intl';
import { InputLabel, SelectHorizontal, FormSection, Form } from '~core/Fields';
import Numeral from '~core/Numeral';

import styles from './LockedExpenditureSettings.css';
import UserAvatar from '~core/UserAvatar';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { tokens as tokensData } from './constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import UserMention from '~core/UserMention';
import ColorTag, { Color } from '~core/ColorTag';
import { LoggedInUser } from '~data/index';

const MSG = defineMessages({
  typeLabel: {
    id: 'dashboard.ExpenditurePage.LockedExpenditureSettings.typeLabel',
    defaultMessage: 'Expenditure type',
  },
  teamLabel: {
    id: 'dashboard.ExpenditurePage.LockedExpenditureSettings.teamLabel',
    defaultMessage: 'Team',
  },
  balanceLabel: {
    id: 'dashboard.ExpenditurePage.LockedExpenditureSettings.balanceLabel',
    defaultMessage: 'Balance',
  },
  ownerLabel: {
    id: 'dashboard.ExpenditurePage.LockedExpenditureSettings.ownerLabel',
    defaultMessage: 'Owner',
  },
  optionAdvanced: {
    id: 'dashboard.ExpenditurePage.LockedExpenditureSettings.optionAdvanced',
    defaultMessage: 'Advanced payment',
  },
});

interface Props {
  expenditure?: string;
  team?: { label: string; value: string };
  owner?: Pick<
    LoggedInUser,
    'username' | 'balance' | 'walletAddress' | 'ethereal' | 'networkId'
  >;
}

const LockedExpenditureSettings = ({ expenditure, owner }: Props) => {
  const [activeToken, ...tokens] = tokensData;

  const renderBalanceActiveOption = useCallback(
    () => (
      <div className={styles.label}>
        <span className={styles.icon}>
          <TokenIcon
            className={styles.tokenIcon}
            token={activeToken}
            name={activeToken.name || activeToken.address}
          />
        </span>

        <Numeral
          unit={getTokenDecimalsWithFallback(activeToken.decimals)}
          value={activeToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
        />
        <span className={styles.symbol}>{activeToken.symbol}</span>
      </div>
    ),
    [activeToken],
  );

  const balanceOptions = useMemo(
    () =>
      tokens?.map((token, index) => ({
        label: token.name,
        value: token.id,
        children: (
          <div
            className={classNames(styles.label, styles.option, {
              [styles.firstOption]: index === 0,
            })}
          >
            <span className={styles.icon}>
              <TokenIcon
                className={styles.tokenIcon}
                token={token}
                name={token.name || token.address}
              />
            </span>

            <Numeral
              unit={getTokenDecimalsWithFallback(token.decimals)}
              value={token.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
            />
            <span className={styles.symbol}>{token.symbol}</span>
          </div>
        ),
      })),
    [tokens],
  );

  return (
    <div className={styles.container}>
      <>
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.expenditureContainer}>
            <InputLabel
              label={MSG.typeLabel}
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
              label={MSG.teamLabel}
              appearance={{
                direction: 'horizontal',
              }}
            />
            <div className={styles.activeItem}>
              <ColorTag color={Color.LightPink} />
              <div className={styles.activeItemLabel}>Dev</div>
            </div>
          </div>
        </FormSection>
        <FormSection appearance={{ border: 'bottom' }}>
          {/* 
          Form is added here, because SelectHorizontal has to be wrapped in
          form component. Select horizontal does not call any action on form
          component 
        */}
          <Form initialValues={{}} onSubmit={() => {}}>
            <div className={styles.balance}>
              <SelectHorizontal
                name="balance"
                label={MSG.balanceLabel}
                appearance={{
                  theme: 'alt',
                }}
                options={balanceOptions}
                renderActiveOption={renderBalanceActiveOption}
                unselectable
              />
            </div>
          </Form>
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
              <UserAvatar
                address={owner?.walletAddress || ''}
                size="xs"
                notSet={false}
              />
              <div className={styles.userName}>
                <UserMention username={owner?.username || ''} />
              </div>
            </div>
          </div>
        </FormSection>
      </>
    </div>
  );
};

export default LockedExpenditureSettings;
