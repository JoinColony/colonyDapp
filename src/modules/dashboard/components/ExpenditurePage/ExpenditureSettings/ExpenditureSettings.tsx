import React, { ReactNode, useCallback } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';
import { useFormikContext } from 'formik';

import {
  InputLabel,
  SelectHorizontal,
  SelectOption,
  FormSection,
} from '~core/Fields';
import { Colony, useLoggedInUser, useMembersSubscription } from '~data/index';
import UserAvatar from '~core/UserAvatar';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import UserMention from '~core/UserMention';
import ColorTag, { Color } from '~core/ColorTag';
import DomainDropdown from '~core/DomainDropdown';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import {
  ExpenditureEndDateTypes,
  ExpenditureTypes,
  ValuesType,
} from '~pages/ExpenditurePage/types';
import { supRenderAvatar } from '../Recipient/Recipient';
import { capitalize } from '~utils/strings';

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
  to: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.to',
    defaultMessage: 'To',
  },
  starts: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.starts',
    defaultMessage: 'Starts',
  },
  ends: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.ends',
    defaultMessage: 'Ends',
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
  streaming: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.streaming',
    defaultMessage: 'Streaming',
  },
  whenCancelled: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.whenCancelled',
    defaultMessage: 'When cancelled',
  },
  limitIsReached: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.limitIsReached',
    defaultMessage: 'Limit is reached',
  },
  fixedTime: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.fixedTime',
    defaultMessage: 'Fixed time',
  },
  batch: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.batch',
    defaultMessage: 'Batch',
  },
});

const displayName = 'dashboard.ExpenditurePage.ExpenditureSettings';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
  inEditMode: boolean;
}

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
    label: MSG.streaming,
    value: ExpenditureTypes.Streaming,
  },
  {
    label: MSG.batch,
    value: ExpenditureTypes.Batch,
  },
];

const endDateTypes = [
  {
    label: MSG.whenCancelled,
    value: ExpenditureEndDateTypes.WhenCancelled,
  },
  {
    label: MSG.limitIsReached,
    value: ExpenditureEndDateTypes.LimitIsReached,
  },
  {
    label: MSG.fixedTime,
    value: ExpenditureEndDateTypes.FixedTime,
  },
];

const ExpenditureSettings = ({ colony, sidebarRef, inEditMode }: Props) => {
  const [, { value: expenditure }] = useField('expenditure');
  const { walletAddress, username } = useLoggedInUser();
  const { values } = useFormikContext<ValuesType>() || {};
  const expenditureType = values.expenditure;

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

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });

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
            options={
              inEditMode
                ? [{ label: capitalize(expenditure), value: expenditure }]
                : expeditureTypes
            }
            scrollContainer={sidebarRef}
            placement="bottom"
            withDropdownElelment
            optionSizeLarge
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          {expenditureType === ExpenditureTypes.Streaming ? (
            <UserPickerWithSearch
              data={colonyMembers?.subscribedUsers || []}
              label={MSG.to}
              name="expenditure.user"
              filter={filterUserSelection}
              renderAvatar={supRenderAvatar}
              placeholder="Search"
              sidebarRef={sidebarRef}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        {expenditureType === ExpenditureTypes.Streaming ? (
          <div className={(styles.blue, styles.settingsRow)}>
            <InputLabel
              label={MSG.starts}
              appearance={{
                direction: 'horizontal',
              }}
            />
            {/* Mock element - awaits for datepicker */}
            <>{new Date().toLocaleDateString()}</>
          </div>
        ) : (
          <BalanceSelect
            activeToken={activeToken}
            tokens={tokens}
            name="balance"
          />
        )}
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        {expenditureType === ExpenditureTypes.Streaming ? (
          <div className={styles.blue}>
            <SelectHorizontal
              name="end-date"
              label={MSG.ends}
              appearance={{
                theme: 'alt',
                width: 'content',
              }}
              options={endDateTypes}
              scrollContainer={sidebarRef}
              placement="right"
              withDropdownElelment
            />
          </div>
        ) : (
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
        )}
      </FormSection>
    </div>
  );
};

ExpenditureSettings.displayName = displayName;

export default ExpenditureSettings;
