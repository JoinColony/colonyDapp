import React, { ReactNode, useCallback, useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import classNames from 'classnames';

import { defineMessages } from 'react-intl';
import { DialogSection } from '~core/Dialog';
import { Form, InputLabel, Select, SelectOption } from '~core/Fields';
import { OneDomain, useLoggedInUser } from '~data/index';
import Numeral from '~core/Numeral';

import styles from './ExpenditureSettings.css';
import UserAvatar from '~core/UserAvatar';
import TeamDropdownItem from '~dashboard/Dialogs/AwardAndSmiteDialogs/ManageReputationDialogForm/TeamDropdownItem';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { colonyAddress, domains, tokens as tokensData } from './consts';
import { Appearance } from '~core/Fields/Select/types';
import { Appearance as DialogAppearance } from '~core/Dialog/DialogSection';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import UserMention from '~core/UserMention';

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

  const balanceOptins = useMemo(
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
      {/* eslint-disable-next-line no-warning-comments */}
      {/* TODO: add submit handler and initial values */}
      <Form initialValues={{}} onSubmit={() => {}}>
        <DialogSection appearance={dialogSectionSettings}>
          <Select
            name="expenditure"
            label={MSG.typeLabel}
            appearance={{
              ...appareanceSettings,
              width: 'content',
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
          <Select
            options={domainOptions}
            label={MSG.teamLabel}
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
            label={MSG.balanceLabel}
            appearance={{
              ...appareanceSettings,
              listPosition: 'static',
              optionSize: 'default',
            }}
            options={balanceOptins}
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
      </Form>
    </div>
  );
};

export default ExpenditureSettings;
