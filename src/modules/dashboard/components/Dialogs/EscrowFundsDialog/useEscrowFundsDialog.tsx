import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, {
  useCallback,
  ReactNode,
  useMemo,
  useState,
  useRef,
} from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import ColorTag, { Color } from '~core/ColorTag';
import { FormSection, SelectOption } from '~core/Fields';
import { useColonyFromNameQuery } from '~data/generated';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import styles from './EscrowFundsDialog.css';
import {
  tokens,
  requiredFundsMock,
} from '~dashboard/ExpenditurePage/ExpenditureSettings/constants';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';

const MSG = defineMessages({
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
});

const useEscrowFundsDialog = (colonyName: string) => {
  const sectionRowRef = useRef<HTMLDivElement>(null);
  const [domainID, setDomainID] = useState<number>();
  const { formatMessage } = useIntl();
  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { address: '', name: colonyName },
  });

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

  return {
    filterDomains,
    colonyData,
    balanceOptions,
    requiredFunds,
    renderActiveOption,
    domainID,
    handleMotionDomainChange,
    loading,
    sectionRowRef,
  };
};

export default useEscrowFundsDialog;