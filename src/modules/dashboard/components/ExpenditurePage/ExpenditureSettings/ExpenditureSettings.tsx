import React, { ReactNode, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { defineMessages } from 'react-intl';
import { DialogSection } from '~core/Dialog';
import { InputLabel, Select, SelectOption } from '~core/Fields';
import { useLoggedInUser, useColonyFromNameQuery } from '~data/index';
import Numeral from '~core/Numeral';

import styles from './ExpenditureSettings.css';
import UserAvatar from '~core/UserAvatar';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { tokens as tokensData } from './consts';
import { Appearance } from '~core/Fields/Select/types';
import { Appearance as DialogAppearance } from '~core/Dialog/DialogSection';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import UserMention from '~core/UserMention';
import DomainDropdown from '~core/DomainDropdown';
import ColorTag, { Color } from '~core/ColorTag';
import { SpinnerLoader } from '~core/Preloaders';

const MSG = defineMessages({
  typeLabel: {
    id: 'dashboard.Expenditures.ExpenditureSettings.defaultExpenditureLabel',
    defaultMessage: 'Expenditure type',
  },
  teamLabel: {
    id: 'dashboard.Expenditures.ExpenditureSettings.defaultTeamLabel',
    defaultMessage: 'Team',
  },
  balanceLabel: {
    id: 'dashboard.Expenditures.ExpenditureSettings.defaultBalanceLabel',
    defaultMessage: 'Balance',
  },
  ownerLabel: {
    id: 'dashboard.Expenditures.ExpenditureSettings.defaultOwnerLabel',
    defaultMessage: 'Owner',
  },
  optionAdvanced: {
    id: 'dashboard.Expenditures.ExpenditureSettings.defaultAdvancedOption',
    defaultMessage: 'Advanced payment',
  },
});

interface Props {
  colonyName: string;
}

const ExpenditureSettings = () => {
  const { walletAddress, username } = useLoggedInUser();

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { address: '', name: colonyName },
  });

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colonyData?.processedColony || !domainId) {
        return defaultColor;
      }
      const domain = colonyData?.processedColony?.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      return domain ? domain.color : defaultColor;
    },
    [colonyData],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const value = option ? option.value : undefined;
      const color = getDomainColor(value);
      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} />{' '}
          <div className={styles.activeItemLabel}>{label}</div>
        </div>
      );
    },
    [getDomainColor],
  );

  const filterDomains = useCallback((optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);
    if (optionDomainId === 0) {
      return false;
    }
    return true;
  }, []);

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
      tokens.map((token, index) => ({
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

  const appareanceSettings: Appearance = {
    theme: 'alt',
    direction: 'horizontal',
    optionSize: 'large',
    colorSchema: 'lightGrey',
    size: 'small',
  };

  const dialogSectionSettings: DialogAppearance = {
    border: 'bottom',
    margins: 'small',
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <>
          <DialogSection appearance={dialogSectionSettings}>
            <Select
              name="expenditure"
              label={MSG.typeLabel}
              appearance={{
                ...appareanceSettings,
                width: 'content',
                activeOptionColor: 'blue',
              }}
              options={[
                {
                  label: MSG.optionAdvanced,
                  value: 'advanced',
                },
              ]}
            />
          </DialogSection>
          <DialogSection appearance={dialogSectionSettings}>
            <div className={styles.settingsRow}>
              <InputLabel
                label={MSG.teamLabel}
                appearance={{
                  direction: 'horizontal',
                  colorSchema: 'lightGrey',
                }}
              />
              {colonyData && (
                <DomainDropdown
                  colony={colonyData?.processedColony}
                  name="filteredDomainId"
                  renderActiveOptionFn={renderActiveOption}
                  filterOptionsFn={filterDomains}
                  showAllDomains
                  showDescription
                  dataTest="colonyDomainSelector"
                  itemDataTest="colonyDomainSelectorItem"
                  appearance={{ activeOptionColor: 'highlighted' }}
                />
              )}
            </div>
          </DialogSection>
          <DialogSection appearance={dialogSectionSettings}>
            <Select
              name="balance"
              label={MSG.balanceLabel}
              appearance={{
                ...appareanceSettings,
                listPosition: 'static',
                optionSize: 'default',
              }}
              options={balanceOptions}
              renderActiveOption={renderBalanceActiveOption}
              unselectable
            />
          </DialogSection>
          <DialogSection appearance={dialogSectionSettings}>
            <div className={styles.userContainer}>
              <InputLabel
                label={MSG.ownerLabel}
                appearance={{
                  direction: 'horizontal',
                  colorSchema: 'lightGrey',
                }}
              />
              <div className={styles.userAvatarContainer}>
                <UserAvatar address={walletAddress} size="xs" notSet={false} />
                <div className={styles.userName}>
                  <UserMention username={username || ''} />
                </div>
              </div>
            </div>
          </DialogSection>
        </>
      )}
    </div>
  );
};

export default ExpenditureSettings;
