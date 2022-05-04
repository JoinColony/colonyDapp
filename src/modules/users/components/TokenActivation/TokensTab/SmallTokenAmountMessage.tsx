import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import styles from './SmallTokenAmountMessage.css';

const MSG = defineMessage({
  smallAmountHidden: {
    id: `TokenActivation.TokensTab.SmallTokenAmountMessage.smallAmountHidden`,
    defaultMessage: 'Residual balance hidden',
  },
  tooltipText: {
    id: `TokenActivation.TokensTab.SmallTokenAmountMessage.tooltipText`,
    defaultMessage: `There is a small token balance remaining that we couldn’t display. Please click the max button to select the entire balance.`,
  },
});

const displayName = 'SmallTokenAmountMessage';

const SmallTokenAmountMessage = () => (
  <div className={styles.container}>
    <FormattedMessage {...MSG.smallAmountHidden} />
    <QuestionMarkTooltip
      className={styles.tooltipIcon}
      tooltipText={MSG.tooltipText}
      tooltipClassName={styles.tooltip}
      tooltipPopperOptions={{
        placement: 'right',
      }}
    />
  </div>
);

SmallTokenAmountMessage.displayName = displayName;

export default SmallTokenAmountMessage;
