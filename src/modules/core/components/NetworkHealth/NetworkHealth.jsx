/* @flow */

import type { IntlShape } from 'react-intl';

import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';

import Popover from '~core/Popover';
import NetworkHealthIcon from './NetworkHealthIcon';
import NetworkHealthContent from './NetworkHealthContent';

import styles from './NetworkHealth.css';

const MSG = defineMessages({
  /*
   * Shown by the default Browser title on hover
   */
  statusTitle: {
    id: 'core.NetworkHealth.statusTitle',
    defaultMessage: 'Network Health: {health}',
  },
});

type Appearance = {|
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge',
|};

type Props = {|
  appearance?: Appearance,
  className?: string,
  /** @ignore Injected by `injectIntl` */
  intl: IntlShape,
|};

const displayName = 'NetworkHealth';

const NetworkHealth = ({
  appearance,
  className,
  intl: { formatMessage },
}: Props) => {
  /*
   * @TODO Replace with actual aggregated health status
   */
  const health: 'good' | 'mean' | 'critical' = 'mean';
  return (
    <div
      className={className}
      title={formatMessage(MSG.statusTitle, {
        /*
         * Capitalze the first letter
         */
        health: health.charAt(0).toUpperCase() + health.slice(1),
      })}
    >
      <Popover
        appearance={{ theme: 'grey' }}
        content={({ close }) => (
          <NetworkHealthContent close={close} health={health} />
        )}
        placement="bottom"
        showArrow={false}
      >
        <button type="button" className={styles.main}>
          <NetworkHealthIcon health={health} appearance={appearance} />
        </button>
      </Popover>
    </div>
  );
};

NetworkHealth.displayName = displayName;

export default injectIntl(NetworkHealth);
