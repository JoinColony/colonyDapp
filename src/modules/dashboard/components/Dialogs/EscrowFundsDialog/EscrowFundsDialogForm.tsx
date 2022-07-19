import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { DialogSection } from '~core/Dialog';
import DomainDropdown from '~core/DomainDropdown';
import {
  Annotations,
  FormSection,
  InputLabel,
  SelectOption,
  Toggle,
} from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { Colony } from '~data/index';
import Button from '~core/Button';
import ColorTag, { Color } from '~core/ColorTag';
import Numeral from '~core/Numeral';
import {
  requiredFundsMock,
  tokens,
} from '~dashboard/ExpenditurePage/ExpenditureSettings/constants';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './EscrowFundsDialog.css';
import { FormValues } from './EscrowFundsDialog';

const displayName = 'dashboard.EscrowFundsDialog.EscrowFundsDialogForm';

const MSG = defineMessages({
  title: {
    id: 'dashboard.EscrowFundsDialog.title',
    defaultMessage: 'Create a motion to fund expenditure',
  },
  force: {
    id: 'dashboard.EscrowFundsDialog.force',
    defaultMessage: 'Force',
  },
  descriptionText: {
    id: 'dashboard.EscrowFundsDialog.descriptionText',
    defaultMessage: `To create this expenditure you need to get 
    collective approval first. To do so create a motion. 
    It is like asking your teammates if they agree to fund your expenditure.
    `,
  },
  allocationHeader: {
    id: 'dashboard.EscrowFundsDialog.allocationHeader',
    defaultMessage: 'Allocation and resources',
  },
  allocationTeam: {
    id: 'dashboard.EscrowFundsDialog.allocationTeam',
    defaultMessage: 'Team',
  },
  allocationBalance: {
    id: 'dashboard.EscrowFundsDialog.allocationTeam',
    defaultMessage: 'Balance',
  },
  fundsHeader: {
    id: 'dashboard.EscrowFundsDialog.fundsHeader',
    defaultMessage: 'Required funds',
  },
  textareaLabel: {
    id: 'dashboard.EscrowFundsDialog.textareaLabel',
    defaultMessage: `Explain why you're funding this expenditure (optional)`,
  },
  confirmText: {
    id: 'dashboard.EscrowFundsDialog.confirmText',
    defaultMessage: 'Create motion',
  },
  fullFund: {
    id: 'dashboard.EscrowFundsDialog.fullFund',
    defaultMessage: 'Total {name} to fund',
  },
  partialFund: {
    id: 'dashboard.EscrowFundsDialog.partialFund',
    defaultMessage: '{name} to fund',
  },
  total: {
    id: 'dashboard.EscrowFundsDialog.total',
    defaultMessage: 'Total',
  },
  createDomain: {
    id: 'dashboard.EscrowFundsDialog.creationTarget',
    defaultMessage: 'Motion will be created in',
  },
});

interface Props {
  colony: Colony;
  isForce: boolean;
  setIsForce: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
}

const EscrowFundsDialogForm = ({
  colony,
  isForce,
  setIsForce,
  onSubmit,
}: Props) => {
  const { values } = useFormikContext<FormValues>();
  const [domainID, setDomainID] = useState<number>();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (values.force !== isForce) {
      setIsForce(values.force);
    }
  }, [isForce, setIsForce, values]);

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
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
      const domain = colony?.domains.find(
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

  const renderActiveDomainOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      let displayLabel =
        parseInt(option?.value || `${ROOT_DOMAIN_ID}`, 10) === ROOT_DOMAIN_ID
          ? `${formatMessage(MSG.createDomain)} ${label}`
          : `${formatMessage(MSG.createDomain)} ${formatMessage({
              id: 'domain.root',
            })}/${label}`;

      if (!option) {
        displayLabel = `${formatMessage({ id: 'domain.root' })}`;
      }
      return <div className={styles.motionActiveItem}>{displayLabel}</div>;
    },
    [formatMessage],
  );

  const filterDomains = useCallback((optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);

    return optionDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID;
  }, []);

  // @TODO replace the mock with real data
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
              className={styles.tokenNumeral}
            />
            <span className={styles.symbol}>{token.symbol}</span>
          </div>
        ),
      })),
    [],
  );

  // @TODO replace the mock with real data
  const requiredFunds = useMemo(
    () =>
      requiredFundsMock.map((token) => ({
        label: token.name,
        value: token.id,
        children: (
          <FormSection appearance={{ border: 'top' }}>
            <div className={styles.requiredFundsRow}>
              <span>
                {token.isPartial ? (
                  <>
                    <FormattedMessage
                      {...MSG.partialFund}
                      values={{ name: token.name }}
                    />
                    <span className={styles.tokenTotal}>
                      {` (${formatMessage(MSG.total)} ${token.name} `}
                      <Numeral
                        className={styles.tokenNumeralTiny}
                        unit={getTokenDecimalsWithFallback(token.decimals)}
                        value={
                          token.total?.[COLONY_TOTAL_BALANCE_DOMAIN_ID]
                            .amount ?? 0
                        }
                      />
                      )
                    </span>
                  </>
                ) : (
                  <FormattedMessage
                    {...MSG.fullFund}
                    values={{ name: token.name }}
                  />
                )}
              </span>

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
                className={styles.tokenNumeralNormal}
              />
              <span className={styles.symbolNormal}>{token.symbol}</span>
            </div>
          </FormSection>
        ),
      })),
    [formatMessage],
  );

  return (
    <>
      <div className={styles.dialogContainer}>
        <DialogSection appearance={{ theme: 'heading' }}>
          <div>
            <DomainDropdown
              colony={colony}
              name="motionDomainId"
              currentDomainId={domainID}
              renderActiveOptionFn={renderActiveDomainOption}
              filterOptionsFn={filterDomains}
              onDomainChange={handleMotionDomainChange}
              showAllDomains={false}
              showDescription={false}
            />
          </div>

          <div className={styles.forceContainer}>
            <div className={styles.margin}>
              <Toggle
                label={{ id: 'label.force' }}
                name="force"
                appearance={{ theme: 'danger' }}
              />
            </div>
            <Tooltip
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage id="tooltip.forceAction" />
                </div>
              }
              trigger="hover"
              placement="top-end"
            >
              <Icon name="question-mark" className={styles.questionIcon} />
            </Tooltip>
          </div>
        </DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.title} />
        </Heading>
        <DialogSection>
          <div className={styles.description}>
            <FormattedMessage {...MSG.descriptionText} />
          </div>
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom' }}>
          <Heading
            appearance={{
              size: 'small',
              weight: 'bold',
              theme: 'dark',
              margin: 'small',
            }}
          >
            <FormattedMessage {...MSG.allocationHeader} />
          </Heading>
          <FormSection appearance={{ border: 'top' }}>
            <div className={classNames(styles.sectionRow, styles.dropdown)}>
              <InputLabel
                label={MSG.allocationTeam}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              <span className={styles.teamSelectWrapper}>
                <DomainDropdown
                  colony={colony}
                  name="filteredDomainId"
                  renderActiveOptionFn={renderActiveOption}
                  filterOptionsFn={filterDomains}
                  showAllDomains
                  showDescription
                  dataTest="colonyDomainSelector"
                  itemDataTest="colonyDomainSelectorItem"
                />
              </span>
            </div>
          </FormSection>
          <FormSection appearance={{ border: 'top' }}>
            <div className={styles.sectionRow} id={styles.balanceRow}>
              <InputLabel
                label={MSG.allocationBalance}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              <div>
                {balanceOptions.map((balanceOption) => {
                  return (
                    <div key={balanceOption.value}>
                      {balanceOption.children}
                    </div>
                  );
                })}
              </div>
            </div>
          </FormSection>
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom' }}>
          <Heading
            appearance={{
              size: 'small',
              weight: 'bold',
              theme: 'dark',
              margin: 'small',
            }}
          >
            <div className={styles.requiredFundsHeader}>
              <FormattedMessage {...MSG.fundsHeader} />
            </div>
          </Heading>
          {requiredFunds.map((balanceOption) => {
            return (
              <span key={balanceOption.value}>{balanceOption.children}</span>
            );
          })}
        </DialogSection>
        <DialogSection>
          <div className={styles.annotations}>
            <Annotations label={MSG.textareaLabel} name="annotationMessage" />
          </div>
        </DialogSection>
      </div>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          type="submit"
          text={MSG.confirmText}
          onClick={() => {
            // onClick and close are temporary, only handleSubmit should stay here
            onSubmit();
          }}
          autoFocus
        />
      </DialogSection>
    </>
  );
};

EscrowFundsDialogForm.displayName = displayName;

export default EscrowFundsDialogForm;
