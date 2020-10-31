import React, { ReactNode, Dispatch, SetStateAction } from 'react';

import Popover from '~core/Popover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { Colony } from '~data/index';
import { Address } from '~types/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyTotalFundsPopover.css';

interface Props {
  onSelectToken?: Dispatch<SetStateAction<Address>>;
  tokens?: Colony['tokens'][0][];
  children?: ReactNode;
}

const ColonyTotalFundsPopover = ({
  children,
  onSelectToken,
  tokens,
}: Props) => {
  return tokens ? (
    <Popover
      content={({ close }) => (
        <ul className={styles.main}>
          {tokens.map((token) => (
            <li key={token.address}>
              <button
                type="button"
                onClick={() => {
                  if (onSelectToken) {
                    onSelectToken(token.address);
                  }
                  close();
                }}
              >
                <div className={styles.token}>
                  <div className={styles.tokenIconContainer}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={token}
                      name={token.name || token.address}
                    />
                  </div>
                  <div className={styles.tokenInfoContainer}>
                    <span className={styles.tokenSymbol}>
                      {token.symbol || '???'}
                    </span>
                    <span className={styles.tokenBalance}>
                      <Numeral
                        unit={getTokenDecimalsWithFallback(token.decimals)}
                        value={
                          token.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount
                        }
                      />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      trigger="click"
      showArrow={false}
      placement="bottom"
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
              offset: [106, 4],
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
