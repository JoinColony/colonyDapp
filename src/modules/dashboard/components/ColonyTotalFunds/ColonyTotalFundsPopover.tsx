import React, { ReactNode } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Popover from '~core/Popover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { Colony } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyTotalFundsPopover.css';

const MSG = defineMessages({
  unknownToken: {
    id: 'dashboard.ColonyTotalFunds.ColonyTotalFundsPopover.unknownToken',
    defaultMessage: 'unknownToken',
  },
});

interface Props {
  onSelectToken?: () => void;
  tokens?: Colony['tokens'][0][];
  children?: ReactNode;
}

const ColonyTotalFundsPopover = ({
  children,
  onSelectToken = () => {},
  tokens,
}: Props) => {
  const { formatMessage } = useIntl();
  return tokens ? (
    <Popover
      content={
        <ul className={styles.main}>
          {tokens.map((token) => (
            <li className={styles.token} key={token.address}>
              <div className={styles.tokenIcon}>
                <TokenIcon token={token} name={token.name || token.address} />
              </div>
              <div>
                <span className={styles.tokenBalance}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(token.decimals)}
                    value={
                      token.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount
                    }
                    suffix={` ${token.symbol}`}
                  />
                </span>
                <span className={styles.tokenName}>
                  {token.name || formatMessage(MSG.unknownToken)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      }
      trigger="click"
      showArrow={false}
      placement="right"
      popperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              /*
               * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
               *
               * There's no logic to how they are calculated, so next time you need
               * to change them you'll either have to go by exact specs, or change
               * them until it "feels right" :)
               */
              offset: [187, -80],
            },
          },
        ],
      }}
    >
      {children}
    </Popover>
  ) : null;
};

ColonyTotalFundsPopover.displayName =
  'dashboard.ColonyTotalFunds.ColonyTotalFundsPopover';

export default ColonyTotalFundsPopover;
