import React from 'react';
import { defineMessages } from 'react-intl';

import Card from '~core/Card';
import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import styles from './TimeRemainingCard.css';
import Countdown from '~core/Countdown';

interface Props {
  /* Makes the counter a bit more dramatic close to the end of the sale */
  hurryUp?: boolean;
  /* Time remaining in ms */
  msRemaining: number;
}

const displayName = 'dashboard.CoinMachine.TimeRemainingCard';

const MSG = defineMessages({
  help: {
    id: 'dashboard.CoinMachine.TimeRemainingCard.help',
    defaultMessage: "You can't archive when columns have active cards",
  },
  title: {
    id: 'dashboard.CoinMachine.TimeRemainingCard.title',
    defaultMessage:
      '{saleOver, select, false {Time remaining} true {Come back in...}}',
  },
});

const TimeRemainingCard = ({ hurryUp = false, msRemaining = 0 }: Props) => {
  const saleOver = msRemaining <= 0;
  const appearance = {
    theme: saleOver ? 'red' : undefined,
  };
  return (
    <Card
      className={getMainClasses(appearance, styles, { hurryUp })}
      help={MSG.help}
    >
      <div className={styles.heading}>
        <Heading
          appearance={{
            margin: 'none',
            size: 'normal',
            theme: saleOver ? 'invert' : undefined,
          }}
          text={MSG.title}
          textValues={{ saleOver }}
        />
      </div>
      <div className={styles.content}>
        <Countdown className={styles.time} msRemaining={msRemaining} />
      </div>
    </Card>
  );
};

TimeRemainingCard.displayName = displayName;

export default TimeRemainingCard;
